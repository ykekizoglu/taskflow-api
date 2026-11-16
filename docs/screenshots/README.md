# Postman ekran görüntüleri

Koleksiyondaki beş istek 16 Kasım 2026'da Postman 12.36.4'te sırayla çalıştırıldı.
Görüntüler gerçek Postman penceresinden alındı:

1. `01-gorev-ekleme.png` - POST `/tasks`, 201 Created ve oluşturulan görev (`status: pending`)
2. `02-gorev-listeleme.png` - GET `/tasks`, 200 OK ve oluşturulan görevi içeren dizi
3. `03-gorev-detay.png` - GET `/tasks/{{taskId}}`, 200 OK ve aynı id'li görev
4. `04-gorev-guncelleme.png` - PATCH `/tasks/{{taskId}}`, 200 OK ve `completed` durumu
5. `05-gorev-silme.png` - DELETE `/tasks/{{taskId}}`, 204 No Content ve boş gövde

Her görüntüde istek adı, metot, URL, yanıt durum kodu ve varsa JSON yanıtı görünür.
Ayrıntılar: `../postman-test-sonuclari.md`.
