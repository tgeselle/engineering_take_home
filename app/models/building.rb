class Building < ApplicationRecord
  belongs_to :client
  has_many :custom_field_values, dependent: :destroy

  validates :address, :state, :zipcode, presence: true
  validates :address, uniqueness: { scope: [ :state, :zipcode ], message: "already exists at this location" }
end
