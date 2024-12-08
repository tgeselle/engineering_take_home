class CreateCustomFields < ActiveRecord::Migration[7.2]
  def change
    create_enum :custom_field_type, %w[number freeform enum]

    create_table :custom_fields do |t|
      t.references :client, null: false, foreign_key: true
      t.string :name, null: false
      t.enum :field_type, enum_type: :custom_field_type, null: false

      t.timestamps
    end

    add_index :custom_fields, [ :name, :client_id ], unique: true
  end
end
