# == Schema Information
#
# Table name: enum_options
#
#  id              :bigint           not null, primary key
#  value           :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  custom_field_id :bigint           not null
#
# Indexes
#
#  index_enum_options_on_custom_field_id            (custom_field_id)
#  index_enum_options_on_custom_field_id_and_value  (custom_field_id,value) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (custom_field_id => custom_fields.id)
#
class EnumOption < ApplicationRecord
  belongs_to :custom_field

  validates :value, presence: true, uniqueness: { scope: :custom_field_id, message: "must be unique for each custom field" }
end
