class CustomField < ApplicationRecord
  belongs_to :client
  has_many :enum_options, dependent: :destroy
  has_many :custom_field_values, dependent: :destroy

  validates :name, presence: true
  validates :field_type, presence: true, inclusion: { in: %w[number freeform enum] }
  validates :name, uniqueness: { scope: :client_id, message: "must be unique for each client" }
end
