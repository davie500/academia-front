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

type PlanoInfo = {
  preco: number
  plano_id: number
  periodo_id: number
}

type Precos = Record<Plano, Record<Periodo, PlanoInfo>>

const planoSelecionado = computed<Plano>(() => {
  const plano = String(route.query.plano || '').toLowerCase()
  return plano.includes('plus') ? 'plus' : 'basico'
})

const precos = ref<Precos>({
  basico: {
    mensal: { preco: 0, plano_id: 0, periodo_id: 0 },
    anual: { preco: 0, plano_id: 0, periodo_id: 0 }
  },
  plus: {
    mensal: { preco: 0, plano_id: 0, periodo_id: 0 },
    anual: { preco: 0, plano_id: 0, periodo_id: 0 }
  }
})

const periodo = ref<Periodo>('mensal')
const formaPagamento = ref<'cartao' | 'pix'>('cartao')

const dadosPix = ref({
  nome: '',
  cpf: ''
})

const pixGerado = ref(false)

const planoAtual = computed(() =>
  precos.value[planoSelecionado.value][periodo.value]
)

const preco = computed(() => planoAtual.value.preco)

const precoFormatado = computed(() =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco.value)
)

const nomePeriodo = computed(() =>
  periodo.value === 'mensal' ? 'Mensal' : 'Anual'
)

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

const publicKey = 'APP_USR-ea797ca3-e3cd-4984-82ef-8357bae31316'
const brickController = ref<any>(null)

async function loadMercadoPagoSdk() {
  if ((window as any).MercadoPago) return

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://sdk.mercadopago.com/js/v2'
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.body.appendChild(script)
  })
}

async function initCardBrick() {
  if (!preco.value || preco.value <= 0) return

  await nextTick()

  const Mp = (window as any).MercadoPago
  if (!Mp) return

  const mp = new Mp(publicKey, { locale: 'pt-BR' })
  const bricks = mp.bricks()

  brickController.value = await bricks.create(
    'cardPayment',
    'cardPaymentBrick',
    {
      initialization: {
        amount: Number(preco.value.toFixed(2))
      },
      customization: {
        visual: {
          style: { theme: 'dark' }
        },
        paymentButton: {
          text: 'Pagar agora'
        }
      },
      callbacks: {
        onReady: () => console.log('Card Brick pronto ✔'),

        onSubmit: async (cardData: any) => {
          try {
            loading.value = true

            await api.post('/api/pagamentos', {
              plano_id: planoAtual.value.plano_id,
              periodo_id: planoAtual.value.periodo_id,
              metodo: 'credit_card',
              token: cardData.token,
              parcelas: 1
            })

            alert('Pagamento enviado com sucesso!')
          } catch (err) {
            console.error(err)
            alert('Erro ao processar pagamento')
          } finally {
            loading.value = false
          }
        },

        onError: (error: any) => console.error(error)
      }
    }
  )
}

async function gerarPixQrCode() {
  try {
    const { data } = await api.post('/api/pagamentos', {
      plano_id: planoAtual.value.plano_id,
      periodo_id: planoAtual.value.periodo_id,
      metodo: 'pix',
      first_name: dadosPix.value.nome,
      last_name: dadosPix.value.nome,
      cpf: dadosPix.value.cpf.replace(/\D/g, '')
    },
    {
      headers: {
        Authorization: `Bearer 24|4K4w2XZgYXX1bw264YxtL2x1ucyc4mldKcP5Xwrf14308d5f`
      }
    })

    console.log("RETORNO BACKEND:", data)

    pixGerado.value = true

    await nextTick()

    const container = document.getElementById('pixPaymentBrick')

    if (container && data.pix?.qr_code_base64) {
      container.innerHTML = ''

      const img = document.createElement('img')
      img.src = `data:image/png;base64,${data.pix.qr_code_base64}`
      img.style.maxWidth = '300px'
      img.style.display = 'block'
      img.style.margin = '20px auto'

      container.appendChild(img)
    } else {
      console.error('QR Code não encontrado ou container inexistente')
    }

  } catch (error) {
    console.error("Erro ao gerar PIX:", error)
  }
}

function voltarFormularioPix() {
  pixGerado.value = false
  dadosPix.value = { nome: '', cpf: '' }

  const container = document.getElementById('pixPaymentBrick')
  if (container) container.innerHTML = ''
}

watch(formaPagamento, async (metodo) => {
  if (brickController.value) {
    await brickController.value.unmount()
    brickController.value = null
  }

  if (metodo === 'cartao') {
    await loadMercadoPagoSdk()
    await initCardBrick()
  }
})

watch(preco, async () => {
  if (formaPagamento.value !== 'cartao') return

  if (brickController.value) {
    await brickController.value.unmount()
    brickController.value = null
  }

  await initCardBrick()
})

onMounted(async () => {
  loading.value = true

  try {
    const { data } = await api.get('/api/planoPeriodo')

    data.forEach((item: any) => {
      const nomePlano = item.plano.nome.toLowerCase() as Plano
      const nomePeriodo =
        item.periodo.nome === 'Mensal' ? 'mensal' : 'anual'

      precos.value[nomePlano][nomePeriodo] = {
        preco: Number(item.preco.valor),
        plano_id: item.plano.id,
        periodo_id: item.periodo.id
      }
    })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }

  await loadMercadoPagoSdk()
  await initCardBrick()
})

onBeforeUnmount(async () => {
  if (brickController.value) {
    await brickController.value.unmount()
  }
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
