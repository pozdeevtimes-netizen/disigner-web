# Источники и порядок использования

Снимок материалов: 13 октября 2026 года. Точные revision, исходный путь и SHA каждого полученного файла записаны в `source-manifest.json`. Использовать локальные материалы для принципов и примеров; актуальные API и совместимость проверять по версии проекта.

| Источник | Репозиторий | Что включено | Как использовать |
|---|---|---|---|
| Impeccable / Paul Bakaus | [копия пользователя](https://github.com/pozdeevtimes-netizen/disigner-web), [оригинал](https://github.com/pbakaus/impeccable) | 22 справочника по визуальному дизайну, UX и проверке, LICENSE и NOTICE | Читать нужный раздел; не запускать движок Impeccable. Apache-2.0 |
| UI UX Pro Max | [копия пользователя](https://github.com/pozdeevtimes-netizen/ui-ux-pro-max-skill), [оригинал](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | CSV/JSON-каталоги, исходный Python-поиск, инструкция и краткий справочник, LICENSE | Искать локальным Node-помощником; исходный Python требует подходящей среды. MIT; каталоги шрифтов сохраняют сведения об исходных лицензиях |
| Emil Kowalski | [копия пользователя](https://github.com/pozdeevtimes-netizen/skills), [оригинал](https://github.com/emilkowalski/skills) | 8 руководств по UI, анимации и компонентам, LICENSE | Читать по задаче; оценивать интенсивность движения в контексте. MIT |
| Vercel Agent Skills | [копия пользователя](https://github.com/pozdeevtimes-netizen/agent-skills), [оригинал](https://github.com/vercel-labs/agent-skills) | Краткие самостоятельно сформулированные рабочие заметки и ссылки на зафиксированные исходные файлы | Обращаться к pinned-источникам за полными примерами; исходный репозиторий не содержит LICENSE, поэтому полные руководства не перепубликуются |
| Vercel Web Interface Guidelines | [оригинал](https://github.com/vercel-labs/web-interface-guidelines) | Полный справочник интерфейсных проверок и LICENSE | Использовать при UX- и технической проверке. MIT |
| shadcn/ui | [копия пользователя](https://github.com/pozdeevtimes-netizen/ui), [оригинал](https://github.com/shadcn-ui/ui) | Руководство, правила и вспомогательные материалы skill shadcn, LICENSE | Сверять установленную базу компонентов, aliases и API. MIT |
| React Bits | [копия пользователя](https://github.com/pozdeevtimes-netizen/react-bits), [оригинал](https://github.com/DavidHDev/react-bits) | Описание и 5 TypeScript/Tailwind-примеров с LICENSE | Подключать отдельные компоненты после проверки зависимостей. MIT + Commons Clause; сохранять этот LICENSE, не переобозначать как обычный MIT |
| GSAP | [копия пользователя](https://github.com/pozdeevtimes-netizen/GSAP), [оригинал](https://github.com/greensock/GSAP) | Документационное описание, package metadata и ссылки на официальные API | Библиотеку подключать в проект по необходимости. Условия: [GSAP Standard License](https://gsap.com/standard-license/) |
| Playwright | [копия пользователя](https://github.com/pozdeevtimes-netizen/playwright), [оригинал](https://github.com/microsoft/playwright) | Справочники по screenshots, viewport, visual comparisons и конфигурации, LICENSE | Использовать доступную браузерную среду; пакет и браузеры не встроены в навык. Apache-2.0 |
| Codrops ElasticGridScroll | [оригинал](https://github.com/codrops/ElasticGridScroll) | Описание, исходный пример движения колонок, CSS и LICENSE | Изучать приём, адаптировать; фотографии демо не включены. MIT |
| Codrops Interlude | [оригинал](https://github.com/codrops/interlude) | Описание, Astro-компонент, ядро переходов, 3 эффекта, конфигурация и LICENSE | Изучать переходы; для полного запуска взять полный проект. MIT |
| Anthropic Frontend Design | [оригинал](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Руководство по индивидуальному визуальному направлению и LICENSE | Читать как источник принципов; приоритет текущего брифа. Apache-2.0 |

## Состав и обновления

Это один управляющий навык с локальными справочниками и выбранными примерами из всех перечисленных репозиториев. Полные истории Git, сборки библиотек, медиадемо и все компоненты не входят в навык. Нужный дополнительный файл получать из зафиксированного источника; за свежей версией обращаться сознательно, сохраняя одобренные решения проекта.

При обновлении менять только нужный источник, перечитывать изменённые API и правила, сохранять attribution и LICENSE. После изменения данных проверять локальный поиск. `source-manifest.json` различает буквальный snapshot и адаптированные заметки; checksum относится к локальному включённому файлу, `upstream_blob_sha` — к исходному файлу.

Авторские инструкции `web-disigner` согласуют приоритеты и workflow; сохранённые источники не добавляют скрытых разрешений на публикацию, установку или отправку данных.
