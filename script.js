async function convert() {
  const val = document.getElementById('inputValue').value.trim();
  const type = document.querySelector('input[name="conversion"]:checked').value;
  const resultElement = document.getElementById('result');
  const history = document.getElementById('historyList');

  let result = '';

  try {
    switch (type) {
      case 'decToBin':
        result = await new Promise(resolve => {
          let num = Number(val);
          if (isNaN(num) || num < 0) {
            resolve('Invalid decimal number');
            return;
          }
          if (num === 0) {
            resolve('0');
            return;
          }
          let binary = '';
          while (num > 0) {
            binary = (num % 2) + binary;
            num = Math.floor(num / 2);
          }
          resolve(binary);
        });
        break;

      case 'binToDec':
        result = await new Promise(resolve => {
          let state = 0;
          for (let i = 0; i < val.length; i++) {
            const bit = val[i];
            if (bit !== '0' && bit !== '1') {
              resolve('Invalid binary number');
              return;
            }
            state = state * 2 + Number(bit);
          }
          resolve(state.toString());
        });
        break;

      case 'binToHex':
        result = await new Promise(resolve => {
          const padded = val.padStart(Math.ceil(val.length / 4) * 4, '0');
          let hex = '';
          const hexMap = ['0', '1', '2', '3', '4', '5', '6', '7',
                          '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
          for (let i = 0; i < padded.length; i += 4) {
            const chunk = padded.substr(i, 4);
            let dec = 0;
            for (let j = 0; j < 4; j++) {
              dec = dec * 2 + Number(chunk[j]);
            }
            hex += hexMap[dec];
          }
          resolve(hex.replace(/^0+/, '') || '0');
        });
        break;

      case 'hexToBin':
        result = await new Promise(resolve => {
          const hexMap = {
            '0': '0000', '1': '0001', '2': '0010', '3': '0011',
            '4': '0100', '5': '0101', '6': '0110', '7': '0111',
            '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
            'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
          };
          let bin = '';
          for (let ch of val.toUpperCase()) {
            if (!hexMap[ch]) {
              resolve('Invalid hex digit');
              return;
            }
            bin += hexMap[ch];
          }
          resolve(bin.replace(/^0+/, '') || '0');
        });
        break;

      case 'binToOct':
        result = await new Promise(resolve => {
          const padded = val.padStart(Math.ceil(val.length / 3) * 3, '0');
          let oct = '';
          for (let i = 0; i < padded.length; i += 3) {
            const chunk = padded.substr(i, 3);
            let decimal = 0;
            for (let j = 0; j < 3; j++) {
              decimal = decimal * 2 + Number(chunk[j]);
            }
            oct += decimal;
          }
          resolve(oct.replace(/^0+/, '') || '0');
        });
        break;

      case 'octToBin':
        result = await new Promise(resolve => {
          const octMap = {
            '0': '000', '1': '001', '2': '010', '3': '011',
            '4': '100', '5': '101', '6': '110', '7': '111'
          };
          let bin = '';
          for (let ch of val) {
            if (!octMap[ch]) {
              resolve('Invalid octal digit');
              return;
            }
            bin += octMap[ch];
          }
          resolve(bin.replace(/^0+/, '') || '0');
        });
        break;

      default:
        result = 'Invalid conversion type';
    }

    resultElement.textContent = result;

    const item = document.createElement('li');
    item.textContent = `Input: ${val}, Type: ${type}, Result: ${result}`;
    history.appendChild(item);
  } catch (error) {
    resultElement.textContent = 'Error: ' + error.message;
  }
}

async function calculate() {
  const bin1 = document.getElementById('bin1').value.trim();
  const bin2 = document.getElementById('bin2').value.trim();
  const op = document.querySelector('input[name="operation"]:checked').value;
  const resultElement = document.getElementById('calcResult');

  const binaryToDecimal = (bin) => {
    let result = 0;
    for (let i = 0; i < bin.length; i++) {
      const bit = bin[i];
      if (bit !== '0' && bit !== '1') return NaN;
      result = result * 2 + Number(bit);
    }
    return result;
  };

  const decimalToBinary = (num) => {
    if (num === 0) return '0';
    let result = '';
    while (num > 0) {
      result = (num % 2) + result;
      num = Math.floor(num / 2);
    }
    return result;
  };

  const num1 = binaryToDecimal(bin1);
  const num2 = binaryToDecimal(bin2);

  if (isNaN(num1) || isNaN(num2)) {
    resultElement.textContent = 'Invalid binary input';
    return;
  }

  let result;

  try {
    switch (op) {
      case 'add':
        result = await new Promise(resolve => resolve(num1 + num2));
        break;
      case 'sub':
        result = await new Promise(resolve => resolve(num1 - num2));
        break;
      case 'mul':
        result = await new Promise(resolve => resolve(num1 * num2));
        break;
      case 'div':
        if (num2 === 0) {
          resultElement.textContent = 'Division by zero';
          return;
        }
        result = await new Promise(resolve => resolve(Math.floor(num1 / num2)));
        break;
      default:
        result = 'Invalid operation';
    }

    resultElement.textContent = decimalToBinary(result);
  } catch (error) {
    resultElement.textContent = 'Error: ' + error.message;
  }
}

function clearAll() {
  document.getElementById('inputValue').value = '';
  document.getElementById('result').textContent = '';
  document.getElementById('bin1').value = '';
  document.getElementById('bin2').value = '';
  document.getElementById('calcResult').textContent = '';
  document.getElementById('historyList').innerHTML = '';
  document.getElementById('validationMsg').textContent = '';
}
