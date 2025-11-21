/**
 * Storage service that works with both API and localStorage
 * Falls back to localStorage if API is not available
 */

import { goalsAPI, usersAPI, caravansAPI } from './api';

const USE_API = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== '';

// Goals
export const goalsStorage = {
  async getAll() {
    if (USE_API) {
      try {
        const response = await goalsAPI.getAll();
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.getAllLocal();
      }
    }
    return this.getAllLocal();
  },

  getAllLocal() {
    return JSON.parse(localStorage.getItem('goals') || '[]');
  },

  async getById(id: string) {
    if (USE_API) {
      try {
        const response = await goalsAPI.getById(id);
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.getByIdLocal(id);
      }
    }
    return this.getByIdLocal(id);
  },

  getByIdLocal(id: string) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    return goals.find((g: any) => g.id === id) || null;
  },

  async create(goal: any) {
    if (USE_API) {
      try {
        const response = await goalsAPI.create(goal);
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.createLocal(goal);
      }
    }
    return this.createLocal(goal);
  },

  createLocal(goal: any) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const newGoal = { ...goal, id: goal.id || Date.now().toString() };
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    return newGoal;
  },

  async update(id: string, goal: any) {
    if (USE_API) {
      try {
        const response = await goalsAPI.update(id, goal);
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.updateLocal(id, goal);
      }
    }
    return this.updateLocal(id, goal);
  },

  updateLocal(id: string, goal: any) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const index = goals.findIndex((g: any) => g.id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...goal };
      localStorage.setItem('goals', JSON.stringify(goals));
      return goals[index];
    }
    return null;
  },

  async delete(id: string) {
    if (USE_API) {
      try {
        await goalsAPI.delete(id);
        return true;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.deleteLocal(id);
      }
    }
    return this.deleteLocal(id);
  },

  deleteLocal(id: string) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const filtered = goals.filter((g: any) => g.id !== id);
    localStorage.setItem('goals', JSON.stringify(filtered));
    return true;
  },
};

// Users
export const usersStorage = {
  async getMe() {
    if (USE_API) {
      try {
        const response = await usersAPI.getMe();
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.getMeLocal();
      }
    }
    return this.getMeLocal();
  },

  getMeLocal() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return {
      streak: parseInt(localStorage.getItem('streak') || '0'),
      kilometers: parseInt(localStorage.getItem('kilometers') || '0'),
    };
  },

  async updateMe(data: any) {
    if (USE_API) {
      try {
        const response = await usersAPI.updateMe(data);
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.updateMeLocal(data);
      }
    }
    return this.updateMeLocal(data);
  },

  updateMeLocal(data: any) {
    if (data.streak !== undefined) {
      localStorage.setItem('streak', data.streak.toString());
    }
    if (data.kilometers !== undefined) {
      localStorage.setItem('kilometers', data.kilometers.toString());
    }
    const user = { ...this.getMeLocal(), ...data };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
};

// Caravans
export const caravansStorage = {
  async getAll() {
    if (USE_API) {
      try {
        const response = await caravansAPI.getAll();
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.getAllLocal();
      }
    }
    return this.getAllLocal();
  },

  getAllLocal() {
    return JSON.parse(localStorage.getItem('caravans') || '[]');
  },

  async getById(id: string) {
    if (USE_API) {
      try {
        const response = await caravansAPI.getById(id);
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.getByIdLocal(id);
      }
    }
    return this.getByIdLocal(id);
  },

  getByIdLocal(id: string) {
    const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
    return caravans.find((c: any) => c.id === id) || null;
  },

  async create(caravan: any) {
    if (USE_API) {
      try {
        const response = await caravansAPI.create(caravan);
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.createLocal(caravan);
      }
    }
    return this.createLocal(caravan);
  },

  createLocal(caravan: any) {
    const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
    const newCaravan = { ...caravan, id: caravan.id || Date.now().toString() };
    caravans.push(newCaravan);
    localStorage.setItem('caravans', JSON.stringify(caravans));
    return newCaravan;
  },

  async update(id: string, caravan: any) {
    if (USE_API) {
      try {
        const response = await caravansAPI.update(id, caravan);
        return response.data;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.updateLocal(id, caravan);
      }
    }
    return this.updateLocal(id, caravan);
  },

  updateLocal(id: string, caravan: any) {
    const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
    const index = caravans.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      caravans[index] = { ...caravans[index], ...caravan };
      localStorage.setItem('caravans', JSON.stringify(caravans));
      return caravans[index];
    }
    return null;
  },

  async delete(id: string) {
    if (USE_API) {
      try {
        await caravansAPI.delete(id);
        return true;
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return this.deleteLocal(id);
      }
    }
    return this.deleteLocal(id);
  },

  deleteLocal(id: string) {
    const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
    const filtered = caravans.filter((c: any) => c.id !== id);
    localStorage.setItem('caravans', JSON.stringify(filtered));
    return true;
  },
};

