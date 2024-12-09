class Api::V1::BuildingsController < Api::V1::BaseController
  before_action :set_building, only: [:update]

  # GET /api/v1/buildings
  def index
    @buildings = Building.includes(:client, :custom_field_values, client: :custom_fields)
                         .order(:id)
                         .page(params[:page] || 1)
                         .per(params[:per_page] || 10)
                         .max_paginates_per(10)
  end

  # POST /api/v1/buildings
  def create
    @building = Building.new(building_params)
    if @building.save
      handle_custom_field_values(@building)
      render :create, status: :created
    else
      render :errors, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/buildings/:id
  def update
    if @building.update(building_params)
      handle_custom_field_values(@building)
      render :update, status: :ok
    else
      render :errors, status: :unprocessable_entity
    end
  end    

  private

  def set_building
    @building = Building.find(params[:id])
  end

  def building_params
    params.require(:building).permit(:address, :state, :zipcode, :client_id)
  end

  def handle_custom_field_values(building)
    return unless params[:custom_fields]

    params[:custom_fields].each do |field_name, value|
      custom_field = CustomField.find_by(name: field_name)
      next unless custom_field

      custom_field_value = building.custom_field_values.find_or_initialize_by(custom_field: custom_field)
      custom_field_value.value = value
      custom_field_value.save!
    end
  end
end
