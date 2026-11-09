# Hallmark check

Hallmark 0 FAIL, 0 REFLEX, 2 WARN, 0 waived, 2 notes · render: ran · lang: uk

render tier: 5 screenshots in C:\Users\VeonV\Desktop\Автопан\.hallmark\shots (1280x800, 1440x900, 1920x1080 folds; 1440 and 375 full pages)

| Grade | Gate | Where | Evidence | Fix |
|---|---|---|---|---|
| WARN | 49 | site\src\components\Stations.astro:41 | long clickable label "Маршрут (відкриється карта)" without nowrap | Shorten the label or set nowrap |
| WARN | F4 | site\src\styles\global.css:63 | 2 filled primary-button recipes: .btn--primary + .btn--light | One filled primary per page; demote the rest to outline/quiet variants |

RESULT: PASS
