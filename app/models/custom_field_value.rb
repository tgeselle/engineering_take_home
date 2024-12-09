# == Schema Information
#
# Table name: custom_field_values
#
#  id              :bigint           not null, primary key
#  value           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  building_id     :bigint           not null
#  custom_field_id :bigint           not null
#
# Indexes
#
#  index_custom_field_values_on_building_id                      (building_id)
#  index_custom_field_values_on_building_id_and_custom_field_id  (building_id,custom_field_id) UNIQUE
#  index_custom_field_values_on_custom_field_id                  (custom_field_id)
#
# Foreign Keys
#
#  fk_rails_...  (building_id => buildings.id)
#  fk_rails_...  (custom_field_id => custom_fields.id)
#
class CustomFieldValue < ApplicationRecord
  belongs_to :building
  belongs_to :custom_field

  validates :value, presence: true
  validates :custom_field_id, uniqueness: { scope: :building_id, message: "must be unique for each building" }

  validate :validate_value_type

  private

  # Validates the value type based on the custom field type
  # @return [void]
  def validate_value_type
    case custom_field.field_type
    when "number"
      errors.add(:value, "must be a number") unless value.to_f.to_s == value || value.to_i.to_s == value
    when "enum"
      errors.add(:value, "must be one of the allowed options") unless custom_field.enum_options.pluck(:value).include?(value)
    end
  end
end
