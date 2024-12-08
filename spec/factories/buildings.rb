FactoryBot.define do
  factory :building do
    client { FactoryBot.create(:client) }
    address { Faker::Address.street_address }
    state { Faker::Address.state }
    zipcode { Faker::Address.zip_code }
  end
end
