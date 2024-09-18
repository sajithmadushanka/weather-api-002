const request = require('supertest');
const express = require('express');
const axios = require('axios');
const app = require('../index');

// Mocking axios
jest.mock('axios');

describe('Test Express routes', () => {
  it('should return Hello World on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello World');
  });

  it('should return weather data on GET /temperature with valid city', async () => {
    const mockWeatherData = {
      location: {
        name: 'London',
        country: 'UK',
        region: 'England',
      },
      current: {
        temp_c: 15,
        condition: {
          text: 'Sunny',
        },
      },
    };

    // Mock axios response
    axios.request.mockResolvedValue({ data: mockWeatherData });

    const response = await request(app).get('/temperature').query({ city: 'London', days: 3 });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: 'Success',
      data: {
        city: 'London',
        country: 'UK',
        region: 'England',
        temperature: 15,
        condition: 'Sunny',
      },
    });
  });

  it('should return 404 when city not found', async () => {
    // Mock axios to return null (city not found)
    axios.request.mockResolvedValue(null);

    const response = await request(app).get('/temperature').query({ city: 'Unknown', days: 3 });

    expect(response.statusCode).toBe(200); // Since you're returning a JSON response
    expect(response.body).toEqual({
      code: 404,
      message: 'City not found',
      data: '',
    });
  });
});
