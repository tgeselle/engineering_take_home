class Api::V1::BuildingsController < Api::V1::BaseController
  # GET /api/v1/buildings
  def index
    @buildings = Building.all
  end

  def create
  end
  
  def update
  end    
end
