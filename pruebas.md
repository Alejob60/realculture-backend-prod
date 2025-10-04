#para imagenes directo al video-generator
curl -X POST https://video-converter-drfqdchmdeaehwcd.canadacentral-01.azurewebsites.net/media/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Una bebida energética con diseño moderno y fondo neón",
    "plan": "FREE"
}'

{"success":true,"message":"✅ Imagen generada correctamente","result":{"imageUrl":"https://realculturestorage.blob.core.windows.net/images/promo_20250704133549724.png","prompt":"Una bebida energética con diseño moderno y elegante, en primer plano y centrada, estilo visual futurista minimalista; el fondo presenta un paisaje urbano nocturno con luces neón vibrantes y destellos de color púrpura y azul; iluminación brillante y contrastada que resalta los reflejos en la lata; composición siguiendo la regla de los tercios y líneas de fuga que dirigen la atención hacia el producto, atmósfera dinámica y energética.","imagePath":null,"filename":"promo_20250704133549724.png"}}

# Ruta para el puerto 3001 backend principal

curl -X POST http://localhost:3001/media/image   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OGM1NjFlOC0xZWE4LTQzOTEtODRjYS0zZDVjN2JhMDgzZDQiLCJlbWFpbCI6ImxhYnNjb2RlMjAyNkBvdXRsb29rLmNvbSIsIm5hbWUiOiJBbGVqYW5kcm8gQmVuYXZpZGVzIEJlbmF2aWRlcyIsInJvbGUiOiJGUkVFIiwiaWF0IjoxNzUyNTM3OTkxLCJleHAiOjE3NTI2MjQzOTF9.yauF0ttqHHJcV2cKrH8-8c4u1KVszyml4Woshdygu7s"   -H "Content-Type: application/json"   -d '{
    "prompt": "Una bebida energética con fondo digital brillante"
  }'
{"success":true,"message":"✅ Imagen generada correctamente","result":{"imageUrl":"https://realculturestorage.blob.core.windows.net/images/promo_20250706203248828.png","prompt":"Una bebida energética de diseño moderno y futurista, iluminada por una luz brillante de neón, situada en el centro de la imagen. El fondo consiste en un paisaje digital abstracto con patrones geométricos y destellos de luz vibrante, en tonos azules y púrpuras. Composición utilizando la regla de los tercios, con líneas de fuga que dirigen la mirada hacia la bebida. Estilo visual cyberpunk minimalista, ambiente luminoso y dinámico.","imagePath":null,"filename":"promo_20250706203248828.png","url":"https://realculturestorage.blob.core.windows.net/images/promo_20250706203248828.png?sv=2025-05-05&spr=https&se=2025-07-07T20%3A33%3A05Z&sr=b&sp=r&sig=Kg3rQ%2BM%2BkKzlGK6cv0VTnmUNL2F0t%2FylNxGt7nQTk8k%3D"},"credits":2755}

# Ruta para crear video en video-generator

curl -X POST https://video-converter-drfqdchmdeaehwcd.canadacentral-01.azurewebsites.net/videos/generate   -H "Content-Type: application/json"   -d '{
    "prompt": "Una ciudad futurista iluminada por neones con personas caminando y drones volando",
    "useVoice": false,
    "useSubtitles": false,
    "useMusic": false,
    "useSora": true,
    "plan": "free"
  }'
{"success":true,"message":"Video generado correctamente","result":{"prompt":"Ciudad futurista ultra detallada de estilo cyberpunk, llena de rascacielos recubiertos de hologramas y neones brillantes en tonos púrpura, azul y rosa. Calles mojadas reflejan luces intensas; carteles luminosos y pantallas LED envuelven cada edificio. Personas con ropa tecnológica caminan entre puestos de comida callejera humeante y puertas automáticas, mientras drones metálicos con luces intermitentes surcan el aire a diferentes alturas. Cámara realiza una panorámica descendente desde lo alto de la ciudad, acercándose a nivel de calle y enfocando rostros y detalles de los transeúntes. Iluminación dramática, con contrastes marcados y brillos saturados, resaltando humo y partículas en el aire. Ambientes densos y vibrantes, atmósfera ligeramente neblinosa, estética realista con texturas metálicas, superficies mojadas detalladas y reflejos dinámicos en cada esquina.","videoUrl":"https://realculturestorage.blob.core.windows.net/videos/sora_video_f2cd230016ed481cb005d839b184f056.mp4?se=2025-07-05T14%3A11%3A34Z&sp=r&sv=2025-05-05&sr=b&sig=fhp2xYZ3GUrLONEIyjx4j/EFeNRyzJSD9Ttc2J8sM4U%3D","fileName":"sora_video_f2cd230016ed481cb005d839b184f056.mp4","soraJobId":"task_01jzawbw47fkdrsq131y03vzea","generationId":"gen_01jzawe2azem5sc01z5p4kr270","duration":10,"userId":"anon","timestamp":1751638294100}}

# Ruta para crear video desde backend principal

aleja@Daniela MINGW64 ~/OneDrive/Documentos/ColombiaTIC/RealCulture AI/backend (main)
$ curl -X POST http://localhost:3001/videos/generate   -H "Content-Type: application/json"   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OGM1NjFlOC0xZWE4LTQzOTEtODRjYS0zZDVjN2JhMDgzZDQiLCJlbWFpbCI6ImxhYnNjb2RlMjAyNkBvdXRsb29rLmNvbSIsIm5hbWUiOiJBbGVqYW5kcm8gQmVuYXZpZGVzIEJlbmF2aWRlcyIsInJvbGUiOiJGUkVFIiwiaWF0IjoxNzUyNTM3OTkxLCJleHAiOjE3NTI2MjQzOTF9.yauF0ttqHHJcV2cKrH8-8c4u1KVszyml4Woshdygu7s"   -d '{
    "prompt": "Una ciudad futurista iluminada por neones con personas caminando y drones volando",
    "useVoice": true,
    "useSubtitles": false,
    "useMusic": false,
    "useSora": true
  }'
{"success":true,"message":"🎬 Video generado con éxito","result":{"prompt":"Ciudad futurista de gran escala durante la noche, con enormes rascacielos de cristal reflejando intensos neones en tonos azules, rosas y violetas. Las calles están húmedas y brillan bajo la lluvia reciente, reflejando luces de letreros holográficos y pantallas LED animadas. Multitud de personas con ropa tecnológica y accesorios luminosos caminan por aceras elevadas y pasarelas transparentes. Pequeños drones metálicos con luces parpadeantes vuelan en patrones ordenados entre los edificios y sobre la multitud. Fondo detallado con arquitectura ultramoderna, jardines verticales y vehículos levitando en segundo plano.\n\nMovimiento de cámara: inicia con una panorámica descendente desde el cielo, mostrando el skyline repleto de neones, luego realiza un suave zoom hacia una avenida principal con enfoque dinámico en los peatones y drones en movimiento. Enfoque selectivo sobre detalles como gotas de lluvia sobre el asfalto luminoso y reflejos en los escaparates.\n\nIluminación: ambiente nocturno con iluminación dramática, fuertes contrastes entre zonas iluminadas por neón y áreas en penumbra, luces suaves resaltando rostros y detalles tecnológicos.\n\nEstilo visual: hiperrealista, colores saturados y brillantes, texturas detalladas en vidrio, metal y superficies mojadas, atmósfera vibrante y futurista.","videoUrl":"https://realculturestorage.blob.core.windows.net/videos/sora_video_ba213e7f3d2b43b4809305f9fb243256.mp4?se=2025-07-05T23%3A13%3A38Z&sp=r&sv=2025-05-05&sr=b&sig=tbd5/BJ6%2BYro8wV8uqkDxprSU5TfgJ9NmdO8OgjuFdA%3D","fileName":"sora_video_ba213e7f3d2b43b4809305f9fb243256.mp4","soraJobId":"task_01jzbvcxaqfd4vc95rd61qkn13","generationId":"gen_01jzbvemgxfjhavz6cg0e6j317","duration":10,"userId":"anon","timestamp":1751670818444},"credits":2880} 

# desde localhost:4000 video-generator audio
curl -X POST http://localhost:4000/audio/generate   -H "Content-Type: application/json"   -d '{
    "prompt": "Explica en 30 segundos cómo funciona la energía solar",
    "duration": 30
  }'
{"success":true,"message":"🎧 Audio generado con éxito","result":{"script":"La energía solar funciona capturando la luz del sol con paneles solares. Estos paneles están formados por celdas especiales que convierten la luz solar en electricidad. Esa electricidad puede usarse para encender luces, cargar teléfonos o alimentar casas enteras. Así, aprovechamos una fuente de energía limpia e inagotable, ayudando a cuidar el planeta y reduciendo la contaminación.","duration":26.76,"filename":"audio-61bc388d-76e6-4135-a0fc-d82ffe7f13e8.mp3","blobUrl":"https://realculturestorage.blob.core.windows.net/audio/audio/audio-61bc388d-76e6-4135-a0fc-d82ffe7f13e8.mp3?sv=2025-05-05&spr=https&st=2025-07-06T01%3A18%3A51Z&se=2025-07-07T01%3A18%3A51Z&sr=b&sp=r&sig=JVmzRU1qAOtqqIhVWXSbgefMGUNzGKd4braf%2FIjHf%2BM%3D","audioPath":"C:\\Users\\aleja\\AppData\\Local\\Temp\\audio-61bc388d-76e6-4135-a0fc-d82ffe7f13e8.mp3","generationId":"gen_mcqzhjms_5147","userId":"labs","timestamp":1751764723876}} 

# audio desde video-converter
curl -X POST https://video-converter-drfqdchmdeaehwcd.canadacentral-01.azurewebsites.net/audio/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explica en 30 segundos cómo funciona la energía solar"}'
{"success":true,"message":"🎧 Audio generado con éxito","result":{"script":"La energía solar se obtiene del sol. Los paneles solares capturan la luz solar y la convierten en electricidad gracias a unas celdas especiales llamadas fotovoltaicas. Esta electricidad se puede usar para encender luces, cargar aparatos o calentar agua. Utilizar energía solar ayuda a cuidar el planeta porque no produce contaminación. Así, aprovechamos un recurso natural y renovable que nunca se acaba: la luz del sol.","duration":28.608,"filename":"audio-34445bd9-ca25-4ed4-a3fa-d080eb5ef46a.mp3","blobUrl":"https://realculturestorage.blob.core.windows.net/audio/audio/audio-34445bd9-ca25-4ed4-a3fa-d080eb5ef46a.mp3?sv=2025-05-05&spr=https&st=2025-07-06T15%3A43%3A09Z&se=2025-07-07T15%3A43%3A09Z&sr=b&sp=r&sig=BOaRMfqxj0ehWuO1kSS2F%2ByM%2FxD7L8y5x3OK5AkocRI%3D","generationId":"gen_mcrud3fq_3225","userId":"labs","timestamp":1751816584358}}

