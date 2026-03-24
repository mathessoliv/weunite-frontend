# CNPJs Válidos para Teste

Use estes CNPJs **REALMENTE VÁLIDOS** para testar o cadastro de empresas:

## ✅ CNPJs de Teste Válidos (Verificados)

### 1. **11.222.333/0001-81**

- Números: `11222333000181`
- Status: ✅ VÁLIDO

### 2. **34.028.316/0001-03**

- Números: `34028316000103`
- Status: ✅ VÁLIDO

### 3. **07.526.557/0001-00**

- Números: `07526557000100`
- Status: ✅ VÁLIDO

### 4. **60.701.190/0001-04**

- Números: `60701190000104`
- Status: ✅ VÁLIDO

### 5. **11.444.777/0001-61**

- Números: `11444777000161`
- Status: ✅ VÁLIDO

### 6. **00.000.000/0001-91** (Teste genérico)

- Números: `00000000000191`
- Status: ✅ VÁLIDO

## ❌ Exemplos de CNPJs Inválidos

### **46.379.400/0001-41** ❌

- Números: `46379400000141`
- Erro: Dígito verificador incorreto
- Esperado: `46379400000151` (com dígito 5 no final)

## 🔢 Como Usar

### Opção 1: Digite com formatação

```
11.222.333/0001-81
```

### Opção 2: Digite apenas números

```
11222333000181
```

Ambas as formas funcionam! O sistema formata automaticamente.

## 🧪 Como Testar

1. Acesse a página de cadastro de empresa
2. Cole ou digite qualquer um dos CNPJs válidos acima
3. Observe o console - deve mostrar:
   ```
   CNPJ digitado (números): 11222333000181
   CNPJ digitado (tamanho): 14
   ✅ CNPJ válido: 11222333000181
   ```
4. O formulário deve aceitar e permitir o envio

## 🔍 Debug no Console

### CNPJ Válido:

```
CNPJ digitado (números): 11222333000181
CNPJ digitado (tamanho): 14
CNPJ no blur: 11222333000181
✅ CNPJ válido: 11222333000181
```

### CNPJ Inválido:

```
CNPJ digitado (números): 46379400000141
CNPJ digitado (tamanho): 14
CNPJ no blur: 46379400000141
❌ CNPJ inválido: primeiro dígito verificador incorreto
```

## 📋 Observações Técnicas

- ✅ O validador remove automaticamente caracteres não numéricos
- ✅ Valida se o CNPJ tem exatamente 14 dígitos
- ✅ Verifica se não é uma sequência de dígitos repetidos (ex: 11111111111111)
- ✅ Valida os dois dígitos verificadores usando o algoritmo oficial da Receita Federal
- ✅ O algoritmo segue a norma oficial brasileira para validação de CNPJ

## 🎯 Dica Rápida

**Copie e cole este CNPJ válido para teste rápido:**

```
11222333000181
```
