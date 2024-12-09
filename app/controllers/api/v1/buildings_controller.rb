class Api::V1::BuildingsController < Api::V1::BaseController
  # GET /api/v1/buildings
  def index
    @buildings = Building.includes(:client, :custom_field_values, client: :custom_fields)
                         .order(:id)
                         .page(params[:page] || 1)
                         .per(params[:per_page] || 10)
                         .max_paginates_per(10)
  end

  def create
  end
  
  def update
  end    
end
