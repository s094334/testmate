import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BankIcon } from '@/components/icons/BankIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'
import { tester, type Payout } from '@/data/tester'
import { payoutFields } from './fields'

export function PayoutAccount() {
  const [account, setAccount] = useState(tester.payout)
  const [editing, setEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Payout>({
    shouldFocusError: false,
    defaultValues: tester.payout ?? {
      bankCode: '',
      branchCode: '',
      accountNumber: '',
      holderName: '',
    },
  })

  return (
    <div className="border-line flex flex-col gap-6 border-t pt-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-subheading">收款帳戶</h3>
          <p className="text-ink-subtle">
            簽署保密協議前需要設定收款帳戶，後續報酬會匯入帳戶中。
          </p>
        </div>

        {/* Desktop only: on mobile, 儲存帳戶 is in the bar at the bottom */}
        {(!account || editing) && (
          <div className="desktop:flex hidden gap-3">
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="border-role bg-surface hover:bg-role-soft min-h-12 rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
              >
                取消
              </button>
            )}
            {/* Sits outside the <form> below; form="payout-form" still makes it submit that form */}
            <button
              type="submit"
              form="payout-form"
              className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
            >
              儲存帳戶
            </button>
          </div>
        )}
      </div>

      {!account && (
        <div className="bg-status-pending-bg text-status-pending-text flex max-w-220 items-start gap-3 rounded-md p-4">
          <WarningIcon className="mt-0.5 size-5 flex-none" />
          <p>
            <b>提醒：還沒設定收款帳戶</b>
            <br />
            設定完成後，才能簽署保密協議，繼續測試流程唷。
          </p>
        </div>
      )}

      {account && !editing && (
        <div className="border-line bg-surface desktop:flex-row desktop:items-center desktop:justify-between flex max-w-220 flex-col gap-4 rounded-md border px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <BankIcon />
            <div className="flex min-w-0 flex-col gap-0.5">
              <b className="flex flex-wrap gap-x-3 text-[18px] tabular-nums">
                <span>
                  {account.bankCode} ****{account.accountNumber.slice(-4)}
                </span>
                <span>{account.holderName}</span>
              </b>
              <span className="text-ink-subtle">
                已設定、撥款會匯到這個帳戶
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              reset(account)
              setEditing(true)
            }}
            className="border-role bg-surface hover:bg-role-soft min-h-12 rounded-full border-2 px-8 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            修改
          </button>
        </div>
      )}

      {(!account || editing) && (
        <form
          id="payout-form"
          noValidate
          onSubmit={handleSubmit((values) => {
            setAccount({ ...values, holderName: values.holderName.trim() })
            setEditing(false)
          })}
          className="flex flex-col gap-5"
        >
          {editing && (
            <p className="text-ink-subtle">
              修改後，之後的撥款會匯到新的帳戶。
            </p>
          )}

          <div className="desktop:grid-cols-2 grid max-w-220 gap-x-6 gap-y-5">
            {payoutFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label htmlFor={field.name} className="text-label">
                  {field.label}
                  {field.requiredMessage && (
                    <span className="text-status-dispute-text text-required ml-1.5">
                      必填
                    </span>
                  )}
                </label>
                <input
                  id={field.name}
                  type="text"
                  inputMode={field.inputMode}
                  maxLength={field.maxLength}
                  autoComplete={field.autoComplete}
                  {...register(field.name, {
                    required: field.requiredMessage,
                    ...field.rules,
                    onChange: (e) => {
                      if (field.inputMode === 'numeric') {
                        setValue(field.name, e.target.value.replace(/\D/g, ''))
                      }
                    },
                  })}
                  className={`bg-surface min-h-12 w-full rounded-md px-3 ${errors[field.name] ? 'border-status-dispute-text border-2' : 'border-line-input border'}`}
                />
                {errors[field.name] && (
                  <span className="text-status-dispute-text inline-flex items-center gap-1.5">
                    <WarningIcon />
                    {errors[field.name]?.message}
                  </span>
                )}
              </div>
            ))}
          </div>
        </form>
      )}

      {/* Mobile save bar for this block: sticks to the bottom while 收款帳戶 is on screen.
          This block is the last thing in the card, so -mx-4 -mb-5 cancel the card padding */}
      {(!account || editing) && (
        <div className="border-line bg-surface desktop:hidden sticky bottom-0 -mx-4 -mb-5 rounded-b-md border-t px-4 py-3">
          <button
            type="submit"
            form="payout-form"
            className="border-role bg-surface text-ink hover:bg-role hover:text-on-role min-h-12 w-full rounded-full border-2 px-4 font-bold transition-colors duration-150 ease-out active:translate-y-px motion-reduce:active:translate-y-0"
          >
            儲存帳戶
          </button>
        </div>
      )}
    </div>
  )
}
