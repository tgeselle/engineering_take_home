json.status "success"
json.buildings @buildings do |building|
  json.id building.id
  json.client_name building.client.name
  json.address building.address
  json.state building.state
  json.zipcode building.zipcode

  # Include all custom fields for the client, even if empty
  building.client.custom_fields.each do |cf|
    cfv = building.custom_field_values.find_by(custom_field: cf)
    value = cfv&.value
    # Convert number fields to actual numbers
    if cf.field_type == "number" && value.present?
      value = value.include?(".") ? value.to_f : value.to_i
    end
    json.set! cf.name, value
  end
end
