json.status "success"
json.buildings @buildings do |building|
  json.id building.id
  json.client_name building.client.name
  json.address building.address
  json.state building.state
  json.zipcode building.zipcode

  # Créer un hash des custom_field_values pour un accès plus rapide
  custom_field_values_hash = building.custom_field_values.index_by(&:custom_field_id)

  building.client.custom_fields.each do |cf|
    cfv = custom_field_values_hash[cf.id]
    value = cfv&.value
    if cf.field_type == "number" && value.present?
      value = value.include?(".") ? value.to_f : value.to_i
    end
    json.set! cf.name, value
  end
end
