// Lambda handler for calculator API

function calculate(expression) {
  try {
    let processedExpression = expression.trim();

    if (processedExpression === '') {
      throw new Error('Empty expression');
    }

    // Replace × with * and ÷ with / for JavaScript evaluation
    processedExpression = processedExpression
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

    // Handle percentage: Replace patterns like "50%" with "(50/100)"
    processedExpression = processedExpression.replace(/(\d+\.?\d*)%/g, '($1/100)');

    // Validate expression contains only allowed characters
    if (!/^[0-9+\-*/.()\s]+$/.test(processedExpression)) {
      throw new Error('Invalid expression');
    }

    // Remove whitespace
    processedExpression = processedExpression.replace(/\s/g, '');

    // Check for balanced parentheses
    let parenCount = 0;
    for (let char of processedExpression) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) throw new Error('Invalid expression');
    }
    if (parenCount !== 0) throw new Error('Invalid expression');

    // Evaluate using Function constructor
    const result = Function('"use strict"; return (' + processedExpression + ')')();

    if (!isFinite(result)) {
      throw new Error('Division by zero or invalid result');
    }

    // Format result
    if (result % 1 === 0) {
      return result.toString();
    } else {
      return parseFloat(result.toFixed(10)).toString();
    }
  } catch (error) {
    throw new Error('Invalid expression');
  }
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { expression } = body;

    if (!expression || typeof expression !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Expression is required' })
      };
    }

    const result = calculate(expression);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
