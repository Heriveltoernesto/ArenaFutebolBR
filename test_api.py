import requests

def test_brasileirao():
    resp = requests.get("http://localhost:5000/api/jogos?competicao=serie-a&ano=2023")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    if resp.json():
        assert "mandante" in resp.json()[0]
