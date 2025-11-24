import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  const API_URL = 'https://2lgu0yn6pd.execute-api.us-east-2.amazonaws.com/prod/api/calculate';

  const handleNumber = (num) => {
    if (isCalculated) {
      setExpression(num);
      setResult('');
      setIsCalculated(false);
    } else {
      setExpression(prev => prev + num);
    }
  };

  const handleOperator = (op) => {
    if (isCalculated) {
      setExpression(result + op);
      setResult('');
      setIsCalculated(false);
    } else {
      setExpression(prev => {
        if (prev === '') return '';
        // Remove trailing operators and add the new one
        const cleaned = prev.replace(/[+\-×÷%]+$/, '');
        return cleaned + op;
      });
    }
  };

  const handleDecimal = () => {
    if (isCalculated) {
      setExpression('0.');
      setResult('');
      setIsCalculated(false);
    } else {
      setExpression(prev => {
        if (prev === '') return '0.';
        // Check if the last number already has a decimal
        const parts = prev.split(/[+\-×÷%]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart === '' || lastPart.includes('.')) {
          return prev;
        }
        return prev + '.';
      });
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
    setIsCalculated(false);
  };

  const handleBackspace = () => {
    if (isCalculated) {
      handleClear();
    } else {
      setExpression(prev => prev.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    if (expression === '' && result !== '') {
      setResult(prev => {
        const num = parseFloat(prev);
        return num !== 0 ? (-num).toString() : prev;
      });
    } else if (expression !== '') {
      // Toggle sign of the last number in expression
      const parts = expression.split(/([+\-×÷%])/);
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        if (lastPart && !isNaN(lastPart) && lastPart !== '') {
          const num = parseFloat(lastPart);
          if (num !== 0) {
            parts[parts.length - 1] = (-num).toString();
            setExpression(parts.join(''));
          }
        } else {
          // If expression starts with a number, prepend minus sign
          if (!expression.startsWith('-')) {
            setExpression('-' + expression);
          } else {
            setExpression(expression.slice(1));
          }
        }
      }
    }
  };

  const handleEquals = async () => {
    if (expression === '') return;

    try {
      // Clean expression: remove trailing operators
      const cleanedExpression = expression.replace(/[+\-×÷%]+$/, '');
      if (cleanedExpression === '') return;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression: cleanedExpression }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
        setIsCalculated(true);
      } else {
        setResult('Error');
        setIsCalculated(false);
      }
    } catch (error) {
      console.error('Error calculating:', error);
      setResult('Error');
      setIsCalculated(false);
    }
  };

  const displayValue = result !== '' ? result : expression || '0';

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="display-value">{displayValue}</div>
      </div>
      <div className="calculator-buttons">
        <button className="btn btn-clear" onClick={handleClear}>Clear</button>
        <button className="btn btn-backspace" onClick={handleBackspace}>⌫</button>
        <button className="btn btn-operator" onClick={handleToggleSign}>+/-</button>
        <button className="btn btn-operator" onClick={() => handleOperator('%')}>%</button>

        <button className="btn btn-number" onClick={() => handleNumber('7')}>7</button>
        <button className="btn btn-number" onClick={() => handleNumber('8')}>8</button>
        <button className="btn btn-number" onClick={() => handleNumber('9')}>9</button>
        <button className="btn btn-operator" onClick={() => handleOperator('÷')}>÷</button>

        <button className="btn btn-number" onClick={() => handleNumber('4')}>4</button>
        <button className="btn btn-number" onClick={() => handleNumber('5')}>5</button>
        <button className="btn btn-number" onClick={() => handleNumber('6')}>6</button>
        <button className="btn btn-operator" onClick={() => handleOperator('×')}>×</button>

        <button className="btn btn-number" onClick={() => handleNumber('1')}>1</button>
        <button className="btn btn-number" onClick={() => handleNumber('2')}>2</button>
        <button className="btn btn-number" onClick={() => handleNumber('3')}>3</button>
        <button className="btn btn-operator" onClick={() => handleOperator('-')}>-</button>

        <button className="btn btn-number btn-zero" onClick={() => handleNumber('0')}>0</button>
        <button className="btn btn-number" onClick={handleDecimal}>.</button>
        <button className="btn btn-equals" onClick={handleEquals}>=</button>
        <button className="btn btn-operator" onClick={() => handleOperator('+')}>+</button>
      </div>
    </div>
  );
};

export default Calculator;

