require 'rails_helper'

RSpec.describe 'Api::V1::Buildings', type: :request do
  let!(:client) { create(:client) }

  describe 'GET /api/v1/buildings' do
    context 'when buildings exist' do
      before do
        create_list(:building, 3, client: client)
        get '/api/v1/buildings'
      end

      it 'returns http success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns all buildings' do
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['buildings'].size).to eq(3)
      end
    end

    context 'when no buildings exist' do
      before { get '/api/v1/buildings' }

      it 'returns an empty buildings array' do
        json_response = JSON.parse(response.body)
        expect(json_response['buildings']).to be_empty
        expect(json_response['status']).to eq('success')
      end
    end
  end

  describe 'POST /api/v1/buildings' do
    context 'with valid parameters' do
      let(:valid_attributes) do
        {
          address: '123 Test St',
          state: 'California',
          zipcode: '12345',
          client_id: client.id
        }
      end

      it 'creates a new building' do
        expect {
          post '/api/v1/buildings', params: { building: valid_attributes }
        }.to change(Building, :count).by(1)
      end

      it 'returns http created' do
        post '/api/v1/buildings', params: { building: valid_attributes }
        expect(response).to have_http_status(:created)
      end

      it 'returns the created building' do
        post '/api/v1/buildings', params: { building: valid_attributes }
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['building']['address']).to eq(valid_attributes[:address])
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) do
        {
          address: nil,
          state: 'California',
          zipcode: '12345',
          client_id: client.id
        }
      end

      it 'does not create a building' do
        expect {
          post '/api/v1/buildings', params: { building: invalid_attributes }
        }.not_to change(Building, :count)
      end

      it 'returns http unprocessable entity' do
        post '/api/v1/buildings', params: { building: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns error messages' do
        post '/api/v1/buildings', params: { building: invalid_attributes }
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
        expect(json_response).to have_key('errors')
      end
    end
  end

  describe 'PATCH /api/v1/buildings/:id' do
    let!(:building) { create(:building, client: client) }

    context 'with valid parameters' do
      let(:new_attributes) do
        {
          address: 'Updated Address',
          state: 'Updated State'
        }
      end

      before do
        patch "/api/v1/buildings/#{building.id}", params: { building: new_attributes }
      end

      it 'returns http success' do
        expect(response).to have_http_status(:success)
      end

      it 'updates the building' do
        building.reload
        expect(building.address).to eq('Updated Address')
        expect(building.state).to eq('Updated State')
      end

      it 'returns the updated building' do
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['building']['address']).to eq(new_attributes[:address])
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) { { address: nil } }

      before do
        patch "/api/v1/buildings/#{building.id}", params: { building: invalid_attributes }
      end

      it 'returns http unprocessable entity' do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'does not update the building' do
        building.reload
        expect(building.address).not_to be_nil
      end

      it 'returns error messages' do
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
        expect(json_response).to have_key('errors')
      end
    end

    context 'when building does not exist' do
      before do
        patch '/api/v1/buildings/invalid-id', params: { building: { address: 'New Address' } }
      end

      it 'returns http not found' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end 