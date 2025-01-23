# Task

Create a web page with a table that will dynamically display food and beverages with their prices.

## Data

Through the websocket application will receive information about which item has changed its price. If the item is already in the table, the price will be updated. If the item is not in the table, it will first get the price from the http API and then add it to the table with the correct price. There is a finite number of items available.

The application should query the HTTP server at most **once every 5 seconds**.

The description of the data can be found in [API specification](api-specification.md).

## Application

- Application must be written in **React** with **TypeScript**.
- No table cell may be rendered again unless its value has changed.
- Application should use state management.

## Table

The following columns will be present in the table:

- "Name"
  - Text with food name
- "Type"
  - A color tag for each categoryClick to apply
- "Cuisine"
  - The flag of the country where the food comes from (e.g. 🇨🇿)
- "Tags"
  - A color tag with the text "Vegetarian", "Vegan" or "Alcoholic"
- "Price"
  - Price of food
  - In format
    - `12` `CZK` → `12 Kč`
    - `4.2` `EUR` → `4,2 €`
    - `0.69` `CZK` → `0,69 Kč`
    - `56.123` `CZK` → `56,12 Kč`
    - `1234` `CZK` → `1 234 Kč`
    - `9876543.2` `EUR` → `9 876 543,2 €`
- "Creation date"
  - In format `23:59` it was created today
  - In format `31. 12.` it was created this year
  - In format `31. 12. 2000` in other cases
- "Last update"
  - In format `23:59:59` if it was updated today
  - In format `31. 12.` if it was updated this year
  - In format `31. 12. 2000` in other cases

### Table functionality
- Ability to sort the table by any column.
- Ability to filter the table by the content of any column. If the filter matches at least one column, the row will be displayed.


## Technical requirements

The result should be static files running in the browser. No SSR.

- versioning system: **git**
- framework: **[React](https://react.dev) ^18**
- language: **[TypeScript](https://www.typescriptlang.org) >=5.7**
- package manager: **[pnpm](https://pnpm.io/) >=9**
- `package.json` scripts:
  - `dev`[¹](#note-1)
    - starts the application without the need to build static files
    - starts the server that provides the data (file `data-server.mjs`)
  - `build` - creates a build of static files


## Submission method

The zipped git repository as you would commit it to GitHub - including the `.git' folder and excluding the `node_modules' folder.


hr style="margin-top: 3lh;


1) *<a id="note-1"></a> We recommend using the `pnpm` function to run scripts in parallel:*

```jsonc
// package.json
{
  // ...
  "scripts": {
    "dev:app": "vite", // nebo jiný vás způsob spuštění aplikace
    "dev:data-server": "node ./data-server.mjs --port 3000", // the server providing the data; we sent you the file along with this assignment
    "dev": "pnpm run /dev:/" // runs both scripts in parallel
    // ...
  }
  // ...
}
```P
