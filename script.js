let records = [];

function loadRecords() {
    const savedRecords = localStorage.getItem('sockSalesRecords');
    if (savedRecords) {
        records = JSON.parse(savedRecords);
    }
    updateDisplay();
}

function saveRecords() {
    localStorage.setItem('sockSalesRecords', JSON.stringify(records));
}

function updateDisplay() {
    updateStats();
    updateTable();
}

function updateStats() {
    const totalQuantity = records.reduce((sum, record) => sum + record.quantity, 0);
    const totalPrice = records.reduce((sum, record) => sum + record.price, 0);
    
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

function updateTable() {
    const tbody = document.getElementById('recordsBody');
    tbody.innerHTML = '';
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">暂无销售记录</td></tr>';
        return;
    }
    
    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.quantity}</td>
            <td>${record.price.toFixed(2)}</td>
            <td><button class="btn-delete" onclick="deleteRecord(${index})">删除</button></td>
        `;
        tbody.appendChild(row);
    });
}

function addRecord(date, quantity, price) {
    records.push({
        date: date,
        quantity: quantity,
        price: price
    });
    saveRecords();
    updateDisplay();
}

function deleteRecord(index) {
    if (confirm('确定要删除这条记录吗？')) {
        records.splice(index, 1);
        saveRecords();
        updateDisplay();
    }
}

function clearAllRecords() {
    if (confirm('确定要清空所有记录吗？此操作不可恢复！')) {
        records = [];
        saveRecords();
        updateDisplay();
    }
}

document.getElementById('saleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    
    if (date && quantity > 0 && price >= 0) {
        addRecord(date, quantity, price);
        this.reset();
        
        document.getElementById('date').valueAsDate = new Date();
    }
});

document.getElementById('clearAll').addEventListener('click', clearAllRecords);

window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('date').valueAsDate = new Date();
    loadRecords();
});