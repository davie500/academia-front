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
              <button :class="['forma', { ativo: formaPagamento === 'boleto' }]" @click="formaPagamento = 'boleto'">
                🧾 Boleto
              </button>
            </div>

            <div class="conteudo-pagamento">
              <form v-if="formaPagamento === 'cartao'" class="formulario">
                <label>Pagamento com Cartão</label>
                <div id="cardPaymentBrick" style="margin-top:12px;"></div>
                <div style="margin-top:12px; text-align:right; color:var(--color-primary); font-weight:800;">Valor: {{ precoFormatado }}</div>
              </form>

              <div v-if="formaPagamento === 'pix'" class="area-pix">
                <p class="caixa-aviso">
                  Pagamento via PIX é confirmado em até 2 minutos.
                </p>

                <div class="codigo-pix">
                  <input readonly :value="codigoPix" />
                  <button @click="copiarPix">Copiar</button>
                </div>

                <button class="primary outline" @click="confirmarPix">
                  Já fiz o pagamento
                </button>
              </div>

              <form v-if="formaPagamento === 'boleto'" class="formulario">
                <label>Nome Completo</label>
                <input />

                <label>CPF</label>
                <input />

                <label>Email</label>
                <input />

                <div class="info-boleto">
                  <div class="linha-info">
                    <div>Valor</div>
                    <div class="destaque">{{ precoFormatado }}</div>
                  </div>
                  <div class="linha-info">
                    <div>Vencimento</div>
                    <div>{{ vencimentoBoleto }}</div>
                  </div>
                </div>

                <button class="primary">Gerar Boleto</button>
              </form>
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
import { ref, computed, onMounted, watch } from 'vue'
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
const formaPagamento = ref<'cartao' | 'pix' | 'boleto'>('cartao')

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

const codigoPix = ref('00020126PIXCODEFAKE')

function copiarPix() {
  navigator.clipboard?.writeText(codigoPix.value)
}

function confirmarPix() {
  alert('Pagamento PIX confirmado (simulação)')
}

const vencimentoBoleto = computed(() => {
  const data = new Date()
  data.setDate(data.getDate() + 2)
  return data.toLocaleDateString('pt-BR')
})

function formatar(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
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
})

// Mercado Pago Brick integration
const brickController = ref<any>(null)

async function initMercadoPago() {
  try {
    const publicKey = 'APP_USR-ea797ca3-e3cd-4984-82ef-8357bae31316'
    const MpConstructor = (window as any).MercadoPago
    const mp = MpConstructor ? new MpConstructor(publicKey, { locale: 'pt-BR' }) : null

    if (!mp) {
      console.warn('MercadoPago SDK não disponível no window')
      return
    }

    const bricks = mp.bricks()
    // garante um valor mínimo para visualização do Brick
    const amount = Math.max(1, Number((preco.value || 0).toFixed(2)))

    bricks
      .create('cardPayment', 'cardPaymentBrick', {
        initialization: { amount },
        customization: {
          visual: { style: { theme: 'dark' } },
          paymentButton: { text: 'Pagar agora' },
        },
        callbacks: {
          onReady: () => console.log('Brick montado ✔ - amount:', amount),
          onSubmit: async (cardData: any) => {
            try {
              console.log('Dados recebidos do Brick:', cardData)
              loading.value = true
              // enviar token ao backend para processar o pagamento
              await api.post('/pagamento', {
                metodo: 'credit_card',
                tokenCartao: cardData.token,
                valor: amount,
              })
              alert('Pagamento enviado. Aguarde confirmação por e-mail.')
            } catch (err) {
              console.error('Erro no processamento do pagamento:', err)
              alert('Erro ao processar pagamento.')
            } finally {
              loading.value = false
            }
          },
          onError: (err: any) => {
            console.error('Erro no Brick:', err)
            alert('Erro no Brick do Mercado Pago.')
          },
        },
      })
      .then((controller: any) => (brickController.value = controller))
  } catch (err) {
    console.error('initMercadoPago erro:', err)
  }
}

function loadMercadoPagoSdk() {
  if ((window as any).MercadoPago) {
    initMercadoPago()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://sdk.mercadopago.com/js/v2'
  script.onload = () => initMercadoPago()
  document.body.appendChild(script)
}

watch(formaPagamento, (val) => {
  if (val === 'cartao') loadMercadoPagoSdk()
})

// se iniciar já em cartão, carrega SDK
if (formaPagamento.value === 'cartao') loadMercadoPagoSdk()
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

/* Estilos para o container do Mercado Pago Brick */
#cardPaymentBrick {
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

