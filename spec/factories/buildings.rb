# == Schema Information
#
# Table name: buildings
#
#  id         :bigint           not null, primary key
#  address    :string           not null
#  state      :string           not null
#  zipcode    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :bigint           not null
#
# Indexes
#
#  index_buildings_on_address_and_state_and_zipcode  (address,state,zipcode) UNIQUE
#  index_buildings_on_client_id                      (client_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#
FactoryBot.define do
  factory :building do
    client { create(:client) }
    address { Faker::Address.street_address }
    zipcode { Faker::Address.zip_code }    
    state { Faker::Address.state }
  end
end
