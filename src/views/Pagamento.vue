<template>

  <LoadingOverlay
    :show="loading"
    message="Carregando dados do pagamento..."
  />
  
  <div v-if="!loading" class="pagina-pagamento">
    <div class="container">
      <a class="voltar" href="/planos">← Voltar para planos</a>

      <header class="cabecalho">
        <h1>Finalize sua <span class="destaque">Assinatura</span></h1>
        <p class="subtitulo">Escolha o método de pagamento e complete seu cadastro</p>
      </header>

      <div class="grid">
        <main class="conteudo">
          <section class="card selecao-periodo">
            <h3>Período de Cobrança</h3>

            <div class="opcoes-periodo">
              <button
                :class="['opcao-periodo', { ativo: periodo === 'mensal' }]"
                @click="periodo = 'mensal'"
              >
                <div class="rotulo">Mensal</div>
                <div class="valor">{{ formatar(precos[planoSelecionado].mensal) }}</div>
                <div class="descricao">por mês</div>
              </button>

              <button
                :class="['opcao-periodo', { ativo: periodo === 'anual' }]"
                @click="periodo = 'anual'"
              >
                <div class="rotulo">Anual</div>
                <div class="valor">{{ formatar(precos[planoSelecionado].anual) }}</div>
                <div class="descricao">por ano</div>
                <span v-if="periodo === 'anual'" class="selo">Economize</span>
              </button>
            </div>
          </section>

          <section class="card pagamento">
            <h3>Método de Pagamento</h3>

            <div class="formas-pagamento">
              <button :class="['forma', { ativo: formaPagamento === 'cartao' }]" @click="formaPagamento = 'cartao'">
                💳 Cartão
              </button>
              <button :class="['forma', { ativo: formaPagamento === 'pix' }]" @click="formaPagamento = 'pix'">
                🔲 PIX
              </button>
            </div>

            <div class="conteudo-pagamento">
              <form v-show="formaPagamento === 'cartao'" class="formulario">
                <label>Pagamento com Cartão</label>
                <div id="cardPaymentBrick" style="margin-top:12px;"></div>
                <div style="margin-top:12px; text-align:right; color:var(--color-primary); font-weight:800;">Valor: {{ precoFormatado }}</div>
              </form>

              <div v-if="formaPagamento === 'pix'" class="area-pix">
                <div v-if="!pixGerado" class="formulario-pix">
                  <div class="form-group">
                    <label>Nome Completo</label>
                    <input 
                      v-model="dadosPix.nome" 
                      type="text" 
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div class="form-group">
                    <label>CPF</label>
                    <input 
                      v-model="dadosPix.cpf" 
                      type="text" 
                      placeholder="000.000.000-00"
                      @input="formatarCPF"
                    />
                  </div>

                  <button 
                    type="button"
                    class="botao-gerar-pix"
                    @click="gerarPixQrCode"
                    :disabled="!dadosPix.nome || !dadosPix.cpf"
                  >
                    Gerar QR Code PIX
                  </button>
                </div>

                
                <div v-if="pixGerado" class="qr-code-container">
                  <div id="pixPaymentBrick" style="margin-top:12px;"></div>
                  <div style="margin-top:12px; text-align:right; color:var(--color-primary); font-weight:800;">Valor: {{ precoFormatado }}</div>
                  
                  <button 
                    type="button"
                    class="botao-voltar"
                    @click="voltarFormularioPix"
                  >
                    ← Voltar
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside class="lateral">
          <div class="card resumo">
            <h4>Resumo do Pedido</h4>

            <div class="info">
              <div>Plano</div>
              <strong>{{ nomePlano }}</strong>
            </div>

            <div class="info">
              <div>Período</div>
              <strong>{{ nomePeriodo }}</strong>
            </div>

            <hr />

            <div class="total">
              <div>Total</div>
              <div class="valor">{{ precoFormatado }}</div>
            </div>

            <ul class="beneficios">
              <li>✓ Acesso imediato</li>
              <li>✓ Cancele quando quiser</li>
              <li>✓ Suporte 24h</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import api from '@/controller/api'
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const route = useRoute()
const loading = ref(false)

type Plano = 'basico' | 'plus'
type Periodo = 'mensal' | 'anual'

type Precos = Record<Plano, Record<Periodo, number>>

const planoSelecionado = computed<'basico' | 'plus'>(() => {
  const plano = String(route.query.plano || '').toLowerCase()
  return plano.includes('plus') ? 'plus' : 'basico'
})

const precos = ref<Precos>({
  basico: { mensal: 0, anual: 0 },
  plus: { mensal: 0, anual: 0 }
})

const periodo = ref<'mensal' | 'anual'>('mensal')
const formaPagamento = ref<'cartao' | 'pix'>('cartao')

const mostraFormularioPix = ref(false)
const dadosPix = ref({
  nome: '',
  cpf: ''
})
const pixGerado = ref(false)

const preco = computed(() => {
  return precos.value[planoSelecionado.value][periodo.value]
})

const precoFormatado = computed(() =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco.value)
)

const nomePeriodo = computed(() => (periodo.value === 'mensal' ? 'Mensal' : 'Anual'))

const nomePlano = computed(() =>
  planoSelecionado.value === 'plus' ? 'Plano Plus' : 'Plano Básico'
)

function formatar(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

function formatarCPF(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  
  dadosPix.value.cpf = value
}

async function gerarPixQrCode() {
  if (!dadosPix.value.nome || !dadosPix.value.cpf) {
    alert('Preencha todos os campos')
    return
  }

  loading.value = true
  
    try {
    const { data } = await api.post('/api/pagamento', {
      plano_id: planoSelecionado.value === 'plus' ? 2 : 1,
      metodo: 'pix',
      nome: dadosPix.value.nome,
      cpf: dadosPix.value.cpf,
      periodo: periodo.value
    })

    pixGerado.value = true
    
    await nextTick()
    
    // Exibe QR Code retornado pelo backend (base64)
    await initPixBrick(data.pix?.qr_code_base64)
  } catch (err) {
    console.error('Erro ao gerar PIX:', err)
    alert('Erro ao gerar QR Code. Tente novamente.')
  } finally {
    loading.value = false
  }
}

function voltarFormularioPix() {
  pixGerado.value = false
  dadosPix.value = { nome: '', cpf: '' }
  // Limpa o container do PIX (renderizamos apenas a imagem base64 retornada pelo backend)
  const pixContainer = document.getElementById('pixPaymentBrick')
  if (pixContainer) pixContainer.innerHTML = ''
}

onMounted(async () => {
  loading.value = true

  try {
    const { data } = await api.get('/api/planoPeriodo')

    data.forEach((item: any) => {
      const nomePlano = item.plano.nome.toLowerCase() as 'basico' | 'plus'

      const periodo =
        item.periodo.nome === 'Mensal' ? 'mensal' : 'anual'

      precos.value[nomePlano][periodo] = Number(item.preco.valor)
    })
  } catch (error) {
    console.error('Erro ao carregar planos', error)
  } finally {
    loading.value = false
  }

  loadMercadoPagoSdk()
})

const brickController = ref<any>(null)
const publicKey = 'APP_USR-ea797ca3-e3cd-4984-82ef-8357bae31316'

async function loadMercadoPagoSdk() {
  if ((window as any).MercadoPago) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.async = true
    script.onload = () => {
      const check = () => {
        if ((window as any).MercadoPago) return resolve()
        setTimeout(() => {
          if ((window as any).MercadoPago) return resolve()
          resolve()
        }, 50)
      }
      check()
    }
    script.onerror = (err) => reject(new Error('Erro ao carregar SDK MercadoPago'))
    document.body.appendChild(script)
  })
}

async function initCardBrick() {
  // Limpa conteúdo de PIX caso exista (renderizamos apenas a imagem base64)
  const pixContainer = document.getElementById('pixPaymentBrick')
  if (pixContainer) pixContainer.innerHTML = ''

  if (brickController.value) return

  await nextTick()

    try {
    const MpConstructor = (window as any).MercadoPago
    if (!MpConstructor) {
      console.warn('MercadoPago SDK não disponível')
      return
    }

    const mp = new MpConstructor(publicKey, { locale: 'pt-BR' })
    const bricks = mp.bricks()
    const amount = Math.max(1, Number(preco.value.toFixed(2)))

    brickController.value = await bricks.create('cardPayment', 'cardPaymentBrick', {
      initialization: { amount },
      customization: {
        visual: { style: { theme: 'dark' } },
        paymentButton: { text: 'Pagar agora' },
      },
      callbacks: {
        onReady: () => {
          console.log('Card Brick pronto ✔')
        },
        onSubmit: async (cardData: any) => {
          try {
            loading.value = true
            await api.post('/api/pagamento', {
              plano_id: planoSelecionado.value === 'plus' ? 2 : 1,
              metodo: 'credit_card',
              token: cardData.token,
                parcelas: 1,
                periodo: periodo.value
            })
            alert('Pagamento enviado. Aguarde confirmação.')
          } catch (err) {
            console.error('Erro no processamento do pagamento:', err)
            alert('Erro ao processar pagamento.')
          } finally {
            loading.value = false
          }
        },
        onError: (err: any) => {
          console.error('Erro no Card Brick:', err)
        },
      },
    })
  } catch (err) {
    console.error('Erro ao criar Card Brick:', err)
  }
}

async function initPixBrick(qrCodeBase64?: string) {
  if (brickController.value) {
    try {
      await brickController.value.unmount()
    } catch (err) {
      console.log('Erro ao desmontar Card Brick:', err)
    }
    brickController.value = null
  }

  // Apenas renderiza o QR Code recebido do backend. Não criar Wallet Brick no front.
  if (qrCodeBase64) {
    const pixContainer = document.getElementById('pixPaymentBrick')
    if (pixContainer) {
      pixContainer.innerHTML = `<img src="data:image/png;base64,${qrCodeBase64}" style="max-width: 300px; margin: 0 auto; display: block;" />`
    }
    return
  }

  // Se não houver QR base64, não tentamos criar nenhum Brick (o backend deve fornecer o QR).
  console.error('QR code PIX não fornecido pelo backend')
}

// Reage a mudanças no método e no valor para (re)criar/desmontar bricks
watch(
  () => formaPagamento.value,
  async (metodo, _old) => {
    if (loading.value) return

    await loadMercadoPagoSdk()

    // desmonta ambos antes de criar o necessário
    if (brickController.value) {
      try {
        await brickController.value.unmount()
      } catch (err) {
        console.warn('Erro ao desmontar Card Brick:', err)
      }
      brickController.value = null
    }

    // limpa o conteúdo do PIX (se houver)
    const pixContainer = document.getElementById('pixPaymentBrick')
    if (pixContainer) pixContainer.innerHTML = ''

    if (metodo === 'cartao') {
      await initCardBrick()
    }
  },
  { immediate: true }
)

// Reage a mudanças no preço: recriar Card Brick se necessário
watch(
  () => preco.value,
  async (novo, _old) => {
    if (loading.value) return
    if (formaPagamento.value !== 'cartao') return
    // força recriação do card brick para atualizar o amount
    if (brickController.value) {
      try {
        await brickController.value.unmount()
      } catch (err) {
        console.warn('Erro ao desmontar Card Brick para atualização:', err)
      }
      brickController.value = null
    }
    await loadMercadoPagoSdk()
    await initCardBrick()
  }
)

onBeforeUnmount(async () => {
  if (brickController.value) {
    try { await brickController.value.unmount() } catch (e) {}
    brickController.value = null
  }
  // Limpa container PIX (não usamos pixBrickController)
  const pixContainer = document.getElementById('pixPaymentBrick')
  if (pixContainer) pixContainer.innerHTML = ''
})
</script>




<style scoped>
@import "../assets/styles/variables.css";

.pagina-pagamento {
  min-height: 100vh;
  padding: 48px 20px 80px;
  background-image: url('https://img.freepik.com/fotos-gratis/estilo-de-vida-de-equipamentos-de-escritorio-recreacao-de-fitness_1203-5058.jpg?semt=ais_hybrid&w=740&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.95);
  background-blend-mode: overlay;
}

.container {
  max-width: 1180px;
  margin: 0 auto;
}

.voltar {
  display: inline-block;
  margin-bottom: 18px;
  color: var(--color-secondary);
  font-weight: 600;
  text-decoration: none;
}

.cabecalho h1 {
  margin: 0 0 6px;
  font-size: var(--font-size-3xl);
  letter-spacing: -0.5px;
}

.destaque {
  color: var(--color-primary);
}

.subtitulo {
  margin-bottom: 22px;
  color: var(--color-text-secondary);
}

.grid {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.conteudo {
  flex: 1;
}

.lateral {
  width: 340px;
}

.card {
  padding: 22px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.6);
}

.selecao-periodo {
  padding: 20px;
}

.opcoes-periodo {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.opcao-periodo {
  position: relative;
  min-height: 92px;
  flex: 1;
  padding: 18px 22px;
  text-align: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: transparent;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.opcao-periodo .rotulo {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.opcao-periodo .valor {
  margin-top: 6px;
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary);
}

.opcao-periodo .descricao {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.opcao-periodo .selo {
  position: absolute;
  top: 10px;
  right: 12px;
  padding: 4px 6px;
  font-size: 12px;
  border-radius: 6px;
  background: #10b981;
  color: #fff;
}

.opcao-periodo.ativo {
  border-color: rgba(255, 107, 53, 0.65);
  background: linear-gradient(
    180deg,
    rgba(255, 107, 53, 0.03),
    rgba(255, 255, 255, 0.01)
  );
}

.formas-pagamento {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.forma {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: transparent;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.forma.ativo {
  border-color: rgba(255, 107, 53, 0.55);
  background: linear-gradient(
    180deg,
    rgba(255, 107, 53, 0.02),
    transparent
  );
}

.conteudo-pagamento {
  margin-top: 18px;
}

.formulario label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.formulario input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  background: rgba(0, 0, 0, 0.25);
  color: var(--color-text-primary);
}

.linha {
  display: flex;
  gap: 12px;
}

.coluna {
  flex: 1;
}

.primary {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border-radius: 28px;
  border: none;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
}

.primary.outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.area-pix {
  margin-top: 12px;
}

  .formulario-pix {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 22px; 
    border-radius: 20px; 
    border: 1px solid var(--color-border);
    background: rgba(30, 41, 59, 0.5);
    backdrop-filter: blur(8px);
    box-shadow: 0 12px 30px rgba(2, 6, 23, 0.6);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    color: var(--color-text-secondary);
    font-weight: 400;
    text-transform: none;
    letter-spacing: normal;
  }

  .form-group input {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    background: rgba(0, 0, 0, 0.25);
    color: var(--color-text-primary);
    transition: all 0.2s ease;
    font-size: 14px;
  }

  .form-group input:focus {
    outline: none;
    border-color: #3498db;
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
  }

  .form-group input::placeholder {
    color: rgba(160, 174, 192, 0.5);
    font-weight: 400;
  }

  .botao-gerar-pix {
    width: 100%;
    padding: 12px;
    border-radius: 28px;
    border: none;
    font-weight: 800;
    font-size: 15px;
    color: #000000;
    cursor: pointer;
    background-color: rgb(33, 253, 253);
    transition: all 0.18s ease;
    margin-top: 8px;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  }

  .botao-gerar-pix::before {
    display: inline-block;
    transform: translateY(0);
  }

  .botao-gerar-pix:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    opacity: 0.98;
  }

  .botao-gerar-pix:active:not(:disabled) {
    transform: translateY(0);
  }

  .botao-gerar-pix:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }

.qr-code-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.8), rgba(30, 35, 60, 0.8));
  border-radius: 16px;
  border: 1px solid rgba(52, 152, 219, 0.2);
}

.botao-voltar {
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid rgba(52, 152, 219, 0.25);
  background: rgba(15, 23, 42, 0.4);
  color: #3498db;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  letter-spacing: 0.3px;
}

.botao-voltar:hover {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.1);
  color: #5dade2;
}

.caixa-aviso {
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-secondary);
}

.codigo-pix {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.codigo-pix input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
}

.codigo-pix button {
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
}

.info-boleto {
  margin-top: 8px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.01),
    rgba(0, 0, 0, 0.02)
  );
}

.linha-info {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.resumo h4 {
  margin-bottom: 14px;
  font-size: 18px;
}

.resumo .info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: var(--color-text-secondary);
}

.resumo hr {
  margin: 14px 0;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.total .valor {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary);
}

.beneficios {
  padding-left: 18px;
  color: var(--color-text-secondary);
}

.card + .card {
  margin-top: 18px;
}

#cardPaymentBrick {
  padding: 14px;
  border-radius: 12px;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.04);
}

#pixPaymentBrick {
  padding: 14px;
  border-radius: 12px;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.04);
}

@media (max-width: 1000px) {
  .grid {
    flex-direction: column;
  }

  .lateral {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .cabecalho h1 {
    font-size: 32px;
  }

  .primary {
    padding: 10px;
  }

  .opcoes-periodo {
    flex-direction: column;
  }
}

</style>

