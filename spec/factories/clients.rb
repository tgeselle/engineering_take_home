# == Schema Information
#
# Table name: clients
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_clients_on_name  (name) UNIQUE
#
FactoryBot.define do
  factory :client do
    name { Faker::Name.name }
  end
end
