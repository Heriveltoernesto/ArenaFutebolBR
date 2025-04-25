from unicodedata import normalize as nm

def remove_acentos(txt):
    return nm('NFKD', txt).encode('ASCII', 'ignore').decode('ASCII')

def retMes(mes):
    meses = {
        'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04', 'Maio': '05',
        'Junho': '06', 'Julho': '07', 'Agosto': '08', 'Setembro': '09',
        'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
    }
    return meses.get(mes, '01')
