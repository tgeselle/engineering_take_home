# Building Management API

This API allows you to manage building information including details about roof types and custom fields.

## API Endpoints

### Buildings

#### Create a Building
`POST /api/v1/buildings`

When creating a building, the roof type must be one of the following values:
- Flat
- Gable
- Hip
- Mansard
- Shed

Example request:
```json
{
  "building": {
    "name": "Office Building",
    "address": "123 Main Street",
    "roof_type": "Flat",
    "custom_field_values_attributes": [
      {
        "custom_field_id": 1,
        "value": "Example value"
      }
    ]
  }
}
```

#### Update a Building
`PUT /api/v1/buildings/:id`

#### Get Building Details
`GET /api/v1/buildings/:id`

## Custom Fields

The API supports custom fields for buildings. Custom field values can be included when creating or updating a building.

## Error Handling

The API will return appropriate HTTP status codes and error messages:
- 200: Success
- 400: Bad Request
- 422: Unprocessable Entity
- 404: Not Found
- 500: Internal Server Error

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
bundle install
yarn install
```
3. Setup database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

## Testing

Run the test suite:
```bash
rspec
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
