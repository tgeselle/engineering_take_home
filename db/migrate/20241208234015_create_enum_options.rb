class CreateEnumOptions < ActiveRecord::Migration[7.2]
  def change
    create_table :enum_options do |t|
      t.references :custom_field, null: false, foreign_key: true
      t.string :value, null: false

      t.timestamps
    end

    add_index :enum_options, [ :custom_field_id, :value ], unique: true
  end
end
