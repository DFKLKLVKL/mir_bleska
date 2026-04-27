# mir_bleska

STRUCTURE:

MIR_BLESKA/
│
├── backend/                     # C# API
│   └── MirBleska.Api/
│       ├── Controllers/
│       │   └── OrdersController.cs
│       │
│       ├── Data/
│       │   └── AppDbContext.cs
│       │
│       ├── Models/
│       │   └── Order.cs
│       │
│       ├── Migrations/
│       │
│       ├── Program.cs
│       ├── appsettings.json
│       └── MirBleska.Api.csproj
│
├── frontend/                    # фронт 
│   ├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── app.js
│   │   ├── cart.js
│   │   └── utils.js
│   │
│   └── index.html
│
├── README.md
└── docker-compose.yml (потом)


=========================================================================================================================================


SQL:
id, name, phone, email, comment, items, total, status, crate_at





