class CreateCustomFieldValues < ActiveRecord::Migration[7.2]
  def change
    create_table :custom_field_values do |t|
      t.references :building, null: false, foreign_key: true
      t.references :custom_field, null: false, foreign_key: true
      t.string :value

      t.timestamps
    end

    add_index :custom_field_values, [ :building_id, :custom_field_id ], unique: true
  end
end
