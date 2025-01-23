# API Specification

- [HTTP Server](#http-server)
- [WebSocket Server](#websocket-server)


## HTTP Server

### GET `/items`

Returns a list of items.

Query parametry:
- `id` Id of the item
  - type: string
  - required: true
  - multiple: true *?id=1&id=2&=id3*

#### Response 200
- content-type: `application/json`
- body:
  - type: **array of objects**
  - properties:
    - `id`:
      - type: string
      - description: Id of the food or drink.
    - `name`:
      - type: string
      - description: Name of the food or drink.
      - example: `"Hamburger"`
    - `description`:
      - type: string
      - description: Description of the food or drink.
      - example: `"A hamburger is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun. Looks like a menu icon."`
    - `type`:
      - type: union string (`"food"`, `"drink"`)
      - description: Type of the item.
    - `cuisineCountry`:
      - type: string
      - description: Three-letter country ISO code of the cuisine.
      - example: `"USA"`
    - `createdAt`:
      - type: string
      - description: Date when the item was created.
      - example: `"2025-01-16T12:20:26.408Z"`
    - `isVegetarian`:
      - type: boolean
      - description: Whether the item is vegetarian.
      - example: `true`
      - optional: true (default: `false`)
    - `isVegan`:
      - type: boolean
      - description: Whether the item is vegan.
      - example: `false`
      - optional: true (default: `false`)
    - `isAlcoholic`:
      - type: boolean
      - description: Whether the item is alcoholic.
      - example: `false`
      - optional: true (default: `false`)

```jsonc
// body example
[
  {
    "id": "abc123",
    "name": "Irish Coffee",
    "description": "Coffee with Irish whiskey, sugar, and topped with cream.",
    "type": "drink",
    "cuisineCountry": "IRL",
    "createdAt": "2025-01-16T12:20:26.408Z",
    "isVegetarian": true,
    "isVegan": true,
    "isAlcoholic": true
  }
]
```

#### Response 400

- reason: Some given query parameters are invalid.
- content-type: `text/html`

#### Response 405

- reason: Method not allowed.
- content-type: `text/html`


## WebSocket Server

Server sends a message to the client when a item price changes.

### Message

- type: tuple of three elements
- elements:
  - `id`:
    - type: string
    - description: Id of the item.
  - `price`:
    - type: number
    - description: New price of the item.
  - `currency`:
    - type: string union (`"CZK"`, `"EUR"`)
    - description: Currency of the price.
    - example: `"CZK"`


```jsonc
// message example
[
  ["abc123", 160.32, "CZK"],
  ["def456", 199.97, "CZK"],
  ["ghi789", 200.57, "CZK"],
  ["xyz000", 9.9412, "EUR"]
]
```