# TaskFlow API

Node.js ve Express ile geliştirilmiş basit görev yönetimi REST API'si.
Görevler `data/tasks.json` dosyasında saklanır. Dosya ilk çalıştırmada oluşur.

## Amaç ve özellikler

Küçük bir yazılım ekibinin görevlerini oluşturması, sorumlu kişiye ataması,
önceliklendirmesi ve durumlarını takip etmesi için hazırlanmıştır.
Görev ekleme, listeleme, detay görüntüleme, güncelleme ve silme işlemlerini destekler.
Logger middleware her isteğin HTTP metodunu, endpoint'ini ve zaman damgasını terminale yazar.

## Kurulum

Node.js 22 veya üzeri ve npm gerekir. Repoyu **Code → Download ZIP** üzerinden
indirip arşivden çıkarın veya Git ile klonlayın. Terminalde `package.json`
dosyasının bulunduğu klasörü açıp şu komutları çalıştırın:

```sh
npm ci
npm start
```

API adresi: `http://localhost:3000/tasks`. Portu değiştirmek için:

```sh
PORT=3001 npm start
```

Geliştirme sırasında otomatik yeniden başlatma: `npm run dev`.
Otomatik testler: `npm test`.

## Endpoint'ler

| Metot | Adres | Başarılı sonuç |
| --- | --- | --- |
| POST | `/tasks` | 201, oluşturulan görev |
| GET | `/tasks` | 200, görev dizisi |
| GET | `/tasks/:id` | 200, görev |
| PATCH | `/tasks/:id` | 200, güncellenen görev |
| DELETE | `/tasks/:id` | 204, boş yanıt |

POST ve PATCH isteklerinde `Content-Type: application/json` kullanın.
Örnek görev oluşturma gövdesi:

```json
{
  "title": "Backend ödevini tamamla",
  "description": "CRUD endpoint'lerini geliştir ve test et",
  "assignee": "Yusuf",
  "priority": "high"
}
```

Oluşturmada `title` zorunludur. `description` ve `assignee` varsayılan olarak
boş metindir. `priority`: `low`, `medium` (varsayılan), `high`.
`status`: `pending` (varsayılan), `in_progress`, `completed`.
`id`, `createdAt` ve `updatedAt` sunucu tarafından atanır.
PATCH yalnızca gönderilen görev alanlarını değiştirir; örnek: `{"status":"completed"}`.
Bilinmeyen alanlar kaydedilmez. Hatalı veri 400, bulunamayan görev 404 döndürür.
Hata biçimi: `{"error":"Görev bulunamadı."}`.

Her istek için metot, adres ve zaman damgası terminalde görünür.
Bu eğitim projesi tek sunucu süreciyle yerel kullanım için hazırlanmıştır.

## Postman ve teslim

1. Sunucuyu başlatın.
2. Postman'de `postman/TaskFlow.postman_collection.json` dosyasını import edin.
3. İstekleri sırayla çalıştırın. POST isteğinin testi `taskId` değişkenini otomatik doldurur.
4. Beş CRUD isteğinin her biri için adresi, metodu, durum kodunu ve yanıtı gösteren
   ekran görüntüsünü `docs/screenshots/` klasörüne kaydedin.

Ekran görüntüleri gerçek Postman çalıştırmasından alınmıştır ve `docs/screenshots/` klasöründedir.
16 Kasım 2026 tarihli Postman sonuçları:

| İşlem | Sonuç | Ekran görüntüsü |
| --- | --- | --- |
| Görev oluşturma | 201 Created | [Görüntü](docs/screenshots/01-gorev-ekleme.png) |
| Görev listeleme | 200 OK | [Görüntü](docs/screenshots/02-gorev-listeleme.png) |
| Görev detayı | 200 OK | [Görüntü](docs/screenshots/03-gorev-detay.png) |
| Görev güncelleme | 200 OK | [Görüntü](docs/screenshots/04-gorev-guncelleme.png) |
| Görev silme | 204 No Content | [Görüntü](docs/screenshots/05-gorev-silme.png) |

Silinen göreve tekrar GET isteği gönderildiğinde 404 Not Found döner.
Otomatik test sonucu: **1 test, 1 başarılı, 0 hata**.

## Proje belgeleri

- [Proje tanıtımı, senaryo ve veri modeli](docs/proje-tanitimi.md)
- [Postman test sonuçları](docs/postman-test-sonuclari.md)
- [Postman koleksiyonu](postman/TaskFlow.postman_collection.json)
- [Test ekran görüntüleri](docs/screenshots/)

## Klasörler

- `src/routes/tasks.js`: görev CRUD işlemleri
- `src/middleware/logger.js`: istek kaydı
- `src/store.js`: JSON dosyası okuma/yazma
- `test/`: HTTP üzerinden otomatik kontroller
- `docs/`: proje tanıtımı ve Postman ekran görüntüleri
- `postman/`: içe aktarılabilir test koleksiyonu
