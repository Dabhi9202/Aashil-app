import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  goals: [],
  loading: false,
  error: null,
  totalSaved: 0,
  totalTarget: 0,
  completedGoals: 0
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_GOALS: 'LOAD_GOALS',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  DELETE_GOAL: 'DELETE_GOAL',
  ADD_DEPOSIT: 'ADD_DEPOSIT',
  WITHDRAW_FUNDS: 'WITHDRAW_FUNDS',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS'
};

// Reducer function
const goalsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.LOAD_GOALS:
      return { 
        ...state, 
        goals: action.payload, 
        loading: false, 
        error: null 
      };
    
    case ACTIONS.ADD_GOAL:
      return { 
        ...state, 
        goals: [...state.goals, action.payload],
        error: null 
      };
    
    case ACTIONS.UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? action.payload : goal
        ),
        error: null
      };
    
    case ACTIONS.DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload),
        error: null
      };
    
    case ACTIONS.ADD_DEPOSIT:
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.goalId 
            ? { 
                ...goal, 
                currentAmount: goal.currentAmount + action.payload.amount,
                updatedAt: new Date().toISOString(),
                transactions: [
                  ...(goal.transactions || []),
                  {
                    id: Date.now().toString(),
                    amount: action.payload.amount,
                    type: 'deposit',
                    description: action.payload.description || 'Manual deposit',
                    createdAt: new Date().toISOString()
                  }
                ]
              }
            : goal
        ),
        error: null
      };
    
    case ACTIONS.WITHDRAW_FUNDS:
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.goalId 
            ? { 
                ...goal, 
                currentAmount: Math.max(0, goal.currentAmount - action.payload.amount),
                updatedAt: new Date().toISOString(),
                transactions: [
                  ...(goal.transactions || []),
                  {
                    id: Date.now().toString(),
                    amount: action.payload.amount,
                    type: 'withdrawal',
                    description: action.payload.description || 'Manual withdrawal',
                    createdAt: new Date().toISOString()
                  }
                ]
              }
            : goal
        ),
        error: null
      };
    
    case ACTIONS.CALCULATE_TOTALS:
      const totalSaved = state.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
      const totalTarget = state.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
      const completedGoals = state.goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
      
      return {
        ...state,
        totalSaved,
        totalTarget,
        completedGoals
      };
    
    default:
      return state;
  }
};

// Create context
const GoalsContext = createContext();

// Context provider component
export const GoalsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalsReducer, initialState);

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('saveup-goals');
    if (savedGoals) {
      try {
        const goals = JSON.parse(savedGoals);
        dispatch({ type: ACTIONS.LOAD_GOALS, payload: goals });
      } catch (error) {
        console.error('Error loading goals from localStorage:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load saved goals' });
      }
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    if (state.goals.length > 0) {
      localStorage.setItem('saveup-goals', JSON.stringify(state.goals));
    }
    dispatch({ type: ACTIONS.CALCULATE_TOTALS });
  }, [state.goals]);

  // Action creators
  const actions = {
    createGoal: (goalData) => {
      const newGoal = {
        id: Date.now().toString(),
        ...goalData,
        currentAmount: 0,
        isLocked: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactions: [],
        milestones: [
          { percentage: 25, reached: false },
          { percentage: 50, reached: false },
          { percentage: 75, reached: false },
          { percentage: 100, reached: false }
        ]
      };
      
      dispatch({ type: ACTIONS.ADD_GOAL, payload: newGoal });
      return newGoal;
    },

    updateGoal: (goalId, updates) => {
      const goal = state.goals.find(g => g.id === goalId);
      if (!goal) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Goal not found' });
        return;
      }

      const updatedGoal = {
        ...goal,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: ACTIONS.UPDATE_GOAL, payload: updatedGoal });
      return updatedGoal;
    },

    deleteGoal: (goalId) => {
      dispatch({ type: ACTIONS.DELETE_GOAL, payload: goalId });
    },

    addDeposit: (goalId, amount, description = '') => {
      if (amount <= 0) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Deposit amount must be positive' });
        return;
      }

      const goal = state.goals.find(g => g.id === goalId);
      if (!goal) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Goal not found' });
        return;
      }

      dispatch({ 
        type: ACTIONS.ADD_DEPOSIT, 
        payload: { goalId, amount, description } 
      });

      // Check for milestone achievements
      const newAmount = goal.currentAmount + amount;
      const progress = (newAmount / goal.targetAmount) * 100;
      
      goal.milestones.forEach(milestone => {
        if (progress >= milestone.percentage && !milestone.reached) {
          milestone.reached = true;
          milestone.reachedAt = new Date().toISOString();
          // TODO: Trigger milestone notification
        }
      });
    },

    withdrawFunds: (goalId, amount, description = '') => {
      if (amount <= 0) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Withdrawal amount must be positive' });
        return;
      }

      const goal = state.goals.find(g => g.id === goalId);
      if (!goal) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Goal not found' });
        return;
      }

      if (goal.isLocked) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Cannot withdraw from locked goal' });
        return;
      }

      if (amount > goal.currentAmount) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Insufficient funds' });
        return;
      }

      dispatch({ 
        type: ACTIONS.WITHDRAW_FUNDS, 
        payload: { goalId, amount, description } 
      });
    },

    toggleGoalLock: (goalId) => {
      const goal = state.goals.find(g => g.id === goalId);
      if (!goal) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Goal not found' });
        return;
      }

      actions.updateGoal(goalId, { isLocked: !goal.isLocked });
    },

    clearError: () => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};

// Custom hook to use the goals context
export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export default GoalsContext;

