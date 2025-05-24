
#!/bin/bash

echo "🚀 Uruchamianie aplikacji E-commerce..."

# Sprawdź czy Docker i Docker Compose są zainstalowane
if ! command -v docker &> /dev/null; then
    echo "❌ Docker nie jest zainstalowany. Zainstaluj Docker przed uruchomieniem."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose nie jest zainstalowany. Zainstaluj Docker Compose przed uruchomieniem."
    exit 1
fi

# Zatrzymaj poprzednie kontenery jeśli działają
echo "🛑 Zatrzymywanie poprzednich kontenerów..."
docker-compose down

# Zbuduj i uruchom kontenery
echo "🔨 Budowanie i uruchamianie kontenerów..."
docker-compose up --build -d

# Sprawdź status kontenerów
echo "📊 Sprawdzanie statusu kontenerów..."
docker-compose ps

echo ""
echo "✅ Aplikacja została uruchomiona!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080/api"
echo "❤️ Health Check: http://localhost:8080/api/health"
echo ""
echo "Aby zatrzymać aplikację, użyj: docker-compose down"
echo "Aby zobaczyć logi, użyj: docker-compose logs -f"
