-- The 14 industry tags, in the order listed in API.md (GET /api/tags).
-- Names must match the list exactly; ids are generated here, the frontend reads them from the API.
INSERT INTO "tags" ("category", "name", "sort_order") VALUES
	('industry', '金融保險', 1),
	('industry', '半導體與電子', 2),
	('industry', '電商零售', 3),
	('industry', '遊戲', 4),
	('industry', '影音娛樂', 5),
	('industry', '旅遊住宿', 6),
	('industry', '餐飲外送', 7),
	('industry', '生活服務', 8),
	('industry', '教育', 9),
	('industry', '醫療健康', 10),
	('industry', '交通運輸', 11),
	('industry', '政府與公共服務', 12),
	('industry', '軟體與 SaaS', 13),
	('industry', '其他', 14);
