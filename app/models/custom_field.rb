# == Schema Information
#
# Table name: custom_fields
#
#  id         :bigint           not null, primary key
#  field_type :enum             not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :bigint           not null
#
# Indexes
#
#  index_custom_fields_on_client_id           (client_id)
#  index_custom_fields_on_name_and_client_id  (name,client_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#
class CustomField < ApplicationRecord
  belongs_to :client
  has_many :enum_options, dependent: :destroy
  has_many :custom_field_values, dependent: :destroy

  validates :name, presence: true
  validates :field_type, presence: true, inclusion: { in: %w[number freeform enum] }
  validates :name, uniqueness: { scope: :client_id, message: "must be unique for each client" }
end
