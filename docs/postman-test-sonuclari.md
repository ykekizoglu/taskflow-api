# Postman test sonuçları

- Test tarihi: 16 Kasım 2026
- Araç: Postman 12.36.4 (macOS), "TaskFlow CRUD" koleksiyonu
- Sunucu: `npm start`, `baseUrl` = `http://localhost:3000`

| # | İstek | Metot ve adres | Durum kodu | Postman testleri |
| --- | --- | --- | --- | --- |
| 01 | Görev oluştur | POST `/tasks` | 201 Created | 1/1 geçti |
| 02 | Görevleri listele | GET `/tasks` | 200 OK | 1/1 geçti |
| 03 | Görev detayı | GET `/tasks/{{taskId}}` | 200 OK | 1/1 geçti |
| 04 | Görevi güncelle | PATCH `/tasks/{{taskId}}` | 200 OK | 2/2 geçti |
| 05 | Görevi sil | DELETE `/tasks/{{taskId}}` | 204 No Content | 1/1 geçti |

POST isteğinin test script'i `taskId` değişkenini otomatik doldurdu; sonraki
istekler aynı görev id'siyle çalıştı. Silmeden sonra aynı göreve gönderilen GET
isteği 404 Not Found ve `{"error":"Görev bulunamadı."}` döndürdü.

## Otomatik testler

`npm test` (Node.js v26.7.0): 1 test, 1 geçti, 0 hata.

Ekran görüntüleri: `docs/screenshots/`.
