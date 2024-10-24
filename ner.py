

from transformers import pipeline

model_name = "pierreguillou/ner-bert-base-cased-pt-lenerbr"

ner = pipeline("ner", model=model_name)


sentence = """
O SECRETÁRIO-CHEFE DA CASA CIVIL, no uso da competência conferida pela alínea “b” do inciso II do artigo 26 do Decreto nº 52.833, de 24 de março de 2008, c.c. o artigo 61 do Decreto nº 66.016, de 15 de setembro de 2021, e artigo 10 do Decreto nº 67.435, de 1° de janeiro de 2023, e com fundamento no inciso III do artigo 135 da Lei nº 10.261, de 28 de outubro de 1968, CONCEDE e FIXA, a partir de 2 de outubro de 2024, a Robson Rodrigues de Oliveira, RG 01853457-00 SSP/BA, gratificação mensal, a título de representação, correspondente a 97,00 (noventa e sete inteiros), calculado sobre o valor da Unidade Básica de Valor-UBV, instituída pelo artigo 33 da Lei Complementar nº 1.080, de 17 de dezembro de 2008, e alterações posteriores, correndo às despesas à conta de recursos próprios do orçamento vigente.
"""
t = ner(sentence)

print(t)
# print(f"{sentence}\n{result}")
