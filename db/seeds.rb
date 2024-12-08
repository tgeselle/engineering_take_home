puts "Seeding the database..."

# Create clients
puts "Creating clients..."
clients = FactoryBot.create_list(:client, 5)

# Create Custom Fields for each client
puts "Creating custom fields for each client..."
clients.each do |client|
  # Add a mix of custom field types: number, freeform, enum
  number_field = client.custom_fields.create!(name: "number_of_floors", field_type: "number")
  freeform_field = client.custom_fields.create!(name: "building_color", field_type: "freeform")
  enum_field = client.custom_fields.create!(name: "roof_type", field_type: "enum")

  # Add Enum Options for 'Roof type'
  %w[Flat Gable Hip Mansard Shed].each do |option|
    enum_field.enum_options.create!(value: option)
  end
end

# Create Buildings and associate CustomFieldValues
puts "Creating buildings and custom field values..."
clients.each do |client|
  3.times do |i|
    building = FactoryBot.create(:building, client: client)

    # Assign values for each Custom Field
    client.custom_fields.each do |field|
      case field.field_type
      when "number"
        building.custom_field_values.create!(custom_field: field, value: rand(1..10).to_s)
      when "freeform"
        building.custom_field_values.create!(custom_field: field, value: [ "Red", "Blue", "Green" ].sample)
      when "enum"
        enum_option = field.enum_options.sample
        building.custom_field_values.create!(custom_field: field, value: enum_option.value)
      end
    end
  end
end

puts "Database seeded successfully!"
