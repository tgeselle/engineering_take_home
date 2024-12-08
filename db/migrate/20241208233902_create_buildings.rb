class CreateBuildings < ActiveRecord::Migration[7.2]
  def change
    create_table :buildings do |t|
      t.references :client, null: false, foreign_key: true
      t.string :address, null: false
      t.string :state, null: false
      t.string :zipcode, null: false

      t.timestamps
    end

    add_index :buildings, [:address, :state, :zipcode], unique: true
  end
end
