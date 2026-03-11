# Team 10 Group Project

NCI BSHCIFSC2A - Team Project

## Description

### Roles
- Lorenzo: Project Management & Back-End
- Jean: Front-End & UI/UX Design
- Aaron: Database and Data & Communication and Documentation
- Moise: Quality Assurance & DevOps and Deployment

#### Requirements

ASP.NET API
- .NET 10.0
- ASP.NET Core Runetime 10.0
- Packages: Entity Framework Core-Design-Tools, NPGSQL, Swashbuckle

Angular
- version 19
- TypesScript
- RxJS 7.8 +
- Zone.js 0.14
- Angular CLI 19

Node
- version 22.x(LTS)

Bootstrap
- version 5.3



#### Setup

## Install Angular CLI
npm install -g @angular/cli@19

## Install Dependencies
npm install

## Run the Development Server
ng serve -o

## Build for Production
ng build

## Migration to PostgreSQL
dotnet tool install --global dotnet-ef
dotnet tool update --global dotnet-ef


- Instructions

* open appsetting.json
    
        "DefaultConnection": "Host=localhost;Port=5432;Database=ContractDevDB;Username=postgres;Password="---update your password
    

* open Properties/launchSettings.json (update localhost:)
    http
        "applicationUrl": "http://localhost:yours",
    https
        "applicationUrl": "https://localhost:yours;http://localhost:yours",

* open ContractDevApi/ContractDevApt
    in terminal:
        dotnet restore
        dotnet build
        dotnet run
        dotnet dev-certs https --clean
        dotnet dev-certs https --trust 

* update Entitiy Framework Migrations
    Note: Ensure the database exists in PostgreSQL

    (this creates all the tables and applies migration)
        dotnet ef database update

*   dotnet ef migrations add InitialCreate
    dotnet ef database update


*   -This is to make it easier from now on delete current database, delete all files in Migrations folder. 
    -Create new "ContractDevDb" database, right click database and select query tool.
    -Copy and Paste the contractdevdb.sql in the git repository folder where the project lies into the querytool and execute script.
    -Open terminal in vs code in ContractDevApi\ContractDevApi> dotnet ef migrations add InitialCreate
    -deleted everything inside of the up and down methods (leave the empty methods{}) of  ......._InitialCreate.cs file in the Migrations folder.
    -ContractDevApi\ContractDevApi> dotnet ef database update






