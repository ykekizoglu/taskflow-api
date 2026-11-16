# TaskFlow - Proje Tanıtımı

## Amaç ve senaryo

TaskFlow, küçük bir yazılım ekibinin görevlerini takip edebilmesi için hazırlanmış
bir REST API projesidir. Ekip üyeleri görev oluşturabilir, göreve sorumlu kişi
atayabilir, öncelik belirleyebilir ve görevin durumunu güncelleyebilir.

Örneğin ekip lideri “Backend ödevini tamamla” görevini oluşturur, sorumlu kişinin
adını yazar ve önceliği yüksek olarak belirler. Çalışma başladığında durum
`in_progress`, tamamlandığında `completed` yapılır. Gereksiz görevler silinebilir.

## Temel özellikler

- Görev oluşturma, listeleme ve detay görüntüleme
- Görev bilgilerini, sorumlusunu, durumunu ve önceliğini güncelleme
- Görev silme
- İsteklerin HTTP metodu, endpoint ve zaman damgasıyla terminale kaydı
- Görevlerin yerel JSON dosyasında kalıcı olarak saklanması

## Veri modeli

| Alan | Tip | Açıklama |
| --- | --- | --- |
| id | string | Sunucunun ürettiği benzersiz UUID |
| title | string | Zorunlu görev başlığı |
| description | string | Görev açıklaması |
| assignee | string | Sorumlu kişinin adı |
| priority | string | low, medium veya high |
| status | string | pending, in_progress veya completed |
| createdAt | string | ISO biçiminde oluşturulma zamanı |
| updatedAt | string | ISO biçiminde son güncelleme zamanı |

## API tasarımı

`POST /tasks` görev oluşturur, `GET /tasks` tüm görevleri listeler,
`GET /tasks/:id` tek görevi getirir, `PATCH /tasks/:id` gönderilen alanları
günceller ve `DELETE /tasks/:id` görevi siler. İstek ve yanıtlar JSON biçimindedir;
başarılı silme yanıtının gövdesi yoktur. Kullanım örnekleri README'dedir.

## Teknik yapı ve test

Proje Node.js ve Express kullanır. Routing, logger ve dosya işlemleri ayrı
modüllerde tutulur. Harici veritabanı kurulumu gerekmez. Kapsam görev yönetimidir;
ayrı bir kullanıcı veya proje yönetimi modülü bulunmaz.

Otomatik testler temel CRUD akışını, verilerin yeniden açılışta okunmasını ve
hata durumlarını kontrol eder. Teslim kanıtı için ayrıca beş CRUD işlemi
Postman'de çalıştırılmalı ve ekran görüntüleri repoya eklenmelidir.
