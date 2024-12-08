class EnumOption < ApplicationRecord
  belongs_to :custom_field

  validates :value, presence: true, uniqueness: { scope: :custom_field_id, message: "must be unique for each custom field" }
end
