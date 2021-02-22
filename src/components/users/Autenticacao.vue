<template>
  <v-card flat class="pa-3">
    <v-container fluid class="pa-0 ma-auto">
      <v-row style="min-height: 376px">
        <v-card flat style="border-radius: 10px !important; width: 100%">
          <v-tabs-items v-model="active_tab">
            <v-tab-item v-for="item in tab_items" :key="item.id">
              <v-row>
                <v-col>
                  <p class="clav-content-title-1">
                    {{ item.tab }}
                  </p>
                  <v-card-text class="content-text">
                    <p v-if="item.texto">{{ item.texto }}</p>
                    <div v-if="item.item_ul" class="pt-5">
                      <ul v-for="i_ul in item.item_ul" :key="i_ul.elemento">
                        <li>{{ i_ul.elemento }}</li>
                      </ul>
                    </div>

                    <v-row
                      v-if="item.botoes"
                      class="align-center mt-11"
                      style="text-align: center"
                    >
                      <v-col
                        cols="12"
                        :md="item.md_botao_prop"
                        v-for="botao in item.botoes"
                        :key="botao.descricao"
                      >
                        <v-btn
                          v-if="!botao.form_action"
                          type="submit"
                          @click="HandleFunctionCall(botao.click_event)"
                          rounded
                          class="white--text clav-linear-background"
                        >
                          <unicon
                            :name="botao.icon.nome"
                            width="20"
                            height="20"
                            :viewBox="botao.icon.viewbox"
                            fill="#ffffff"
                          />
                          <p class="ml-2">{{ botao.descricao }}</p>
                        </v-btn>
                        <form
                          v-else
                          :action="botao.form_action"
                          :action_comment="botao.form_action_comment"
                          method="POST"
                        >
                          <input
                            type="hidden"
                            name="SAMLRequest"
                            v-bind:value="createSAML(botao.saml_type)"
                          />
                          <v-btn
                            type="submit"
                            rounded
                            class="white--text clav-linear-background"
                          >
                            <unicon
                              :name="botao.icon.nome"
                              width="20"
                              height="20"
                              :viewBox="botao.icon.viewbox"
                              fill="#ffffff"
                            />
                            <p class="ml-2">{{ botao.descricao }}</p>
                          </v-btn>
                        </form>
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="item.linkAjuda"
                      class="align-center mt-6"
                      style="text-align: center"
                    >
                      <v-col>
                        <p style="display: inline">
                          {{ item.linkAjuda.texto }}
                        </p>

                        <a
                          style="display: inline"
                          @click="HandleFunctionCall(item.linkAjuda.click_event)"
                        >
                          Recuperar
                        </a>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-row>
      <v-row color="#f3f7fc">
        <hr style="border-top: 2px solid #d8d8d8; width: 100%" class="mx-7" />
        <v-tabs v-model="active_tab" grow show-arrows background-color="#f3f7fc">
          <v-tabs-slider color="blue darken-3"></v-tabs-slider>
          <v-tab v-for="item in tab_items" :key="item.id">
            {{ item.tab }}
          </v-tab>
        </v-tabs>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
const lhost = require("@/config/global").host;
const builder = require("xmlbuilder");
const { v4: uuidv4 } = require("uuid");
const SignedXml = require("xml-crypto").SignedXml;
const FileKeyInfo = require("xml-crypto").FileKeyInfo;

import SigningKey from "!raw-loader!./../../certificates/signing_key.pem";
import X509Certificate from "!raw-loader!./../../certificates/x509_certificate.cer";

export default {
  name: "autenticacao",
  data() {
    return {
      active_tab: 1,
      tab_items: [
        {
          id: 0,
          tab: "Como proceder à autenticação?",
          texto:
            "Na plataforma CLAV é possível proceder à autenticação através de um dos seguintes métodos, mediante o botão de login correspondente na aba “Autenticação”:",
          item_ul: [
            { elemento: "Cartão de Cidadão;" },
            { elemento: "Chave Móvel Digital;" },
            {
              elemento: "Email pessoal institucional e respetiva senha de acesso.",
            },
          ],
        },
        {
          id: 1,
          tab: "Autenticação",
          texto:
            "De modo a aceder à plataforma CLAV, por favor escolha um dos seguintes métodos de autenticação:",
          md_botao_prop: 4,
          botoes: [
            {
              descricao: "Cartão de Cidadão",
              form_action: "https://preprod.autenticacao.gov.pt/fa/Default.aspx",
              form_action_comment: "https://autenticacao.gov.pt/fa/Default.aspx",
              saml_type: "CC",
              icon: {
                nome: "cc-icon",
                viewbox: "0 0 20.71 15.532",
              },
            },
            {
              descricao: "Chave Móvel Digital",
              form_action: "https://preprod.autenticacao.gov.pt/fa/Default.aspx",
              form_action_comment: "https://autenticacao.gov.pt/fa/Default.aspx",
              saml_type: "CMD",
              icon: {
                nome: "cmd-icon",
                viewbox: "0 0 20.711 22.947",
              },
            },
            {
              descricao: "Email Pessoal Institucional",
              icon: {
                nome: "email-icon",
                viewbox: "0 0 20.71 20.005",
              },
              click_event: "loginEmail",
            },
          ],
          linkAjuda: {
            texto: "Esqueceu a sua password?",
            click_event: "recuperarPw",
          },
        },
        {
          id: 2,
          tab: "Registo de chaves API",
          texto: "É um fornecedor de serviços? Registe aqui a sua chave API.",
          md_botao_prop: 12,
          botoes: [
            {
              descricao: "Registar",
              icon: {
                nome: "api-icon",
                viewbox: "0 0 20.71 20.71",
              },
              click_event: "registarApi",
            },
          ],
        },
        {
          id: 3,
          tab: "Renovação de chaves API",
          texto: "A sua chave API expirou? Peça aqui a renovação da sua chave API.",
          md_botao_prop: 12,
          botoes: [
            {
              descricao: "Renovar",
              icon: {
                nome: "renovar-api-icon",
                viewbox: "0 0 20.71 20.404",
              },
              click_event: "renovarApi",
            },
          ],
        },
      ],
    };
  },
  methods: {
    HandleFunctionCall(function_name) {
      this[function_name]();
    },
    registarUtilizador() {
      this.$router.push("/users/registo");
    },
    recuperarPw() {
      this.$router.push("/users/recuperacao");
    },
    loginEmail() {
      this.$router.push("/users/login");
    },
    //API
    registarApi() {
      this.$router.push("/gestao/api/registo");
    },
    renovarApi() {
      this.$router.push("/gestao/api/renovar");
    },
    partialXML(uuid) {
      var xml = builder
        .begin({
          encoding: "utf-8",
        })
        .ele({
          AuthnRequest: {
            "@ID": uuid,
            "@Version": "2.0",
            "@IssueInstant": new Date().toISOString(),
            "@Destination": "https://preprod.autenticacao.gov.pt/fa/Default.aspx",
            //Versão prod: "https://autenticacao.gov.pt/fa/Default.aspx",
            "@ProtocolBinding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
            "@AssertionConsumerServiceURL": lhost + "/users/callback",
            "@ProviderName": "CLAV",
            "@xmlns": "urn:oasis:names:tc:SAML:2.0:protocol",
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "@xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "@Consent": "urn:oasis:names:tc:SAML:2.0:consent:unspecified",
          },
        })
        .ele(
          "Issuer",
          {
            xmlns: "urn:oasis:names:tc:SAML:2.0:assertion",
          },
          "http://clav-auth.di.uminho.pt"
        )
        .up()
        .ele("Extensions")
        .ele("fa:RequestedAttributes", {
          "xmlns:fa": "http://autenticacao.cartaodecidadao.pt/atributos",
        })
        .ele("fa:RequestedAttribute", {
          Name: "http://interop.gov.pt/MDC/Cidadao/NIC",
          NameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:uri",
          isRequired: "True",
        })
        .up()
        .ele("fa:RequestedAttribute", {
          Name: "http://interop.gov.pt/MDC/Cidadao/NomeCompleto",
          NameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:uri",
          isRequired: "True",
        });
      return xml;
    },
    ccXML(uuid) {
      return this.partialXML(uuid).end();
    },
    cmdXML(uuid) {
      var xml = this.partialXML(uuid)
        .up()
        .up()
        //Indica que apenas é necessário o level 3 (CMD) para os atributos
        .ele(
          "fa:FAAALevel",
          {
            "xmlns:fa": "http://autenticacao.cartaodecidadao.pt/atributos",
          },
          3
        )
        .up()
        //Politicas de Apresentação
        .ele("fa:AuthTabPresentationPolicies", {
          "xmlns:fa": "http://autenticacao.cartaodecidadao.pt/presentationpolicy",
        })
        //seleciona a Tab default do CMD
        .ele("fa:defaultSelectedAuthTab", {
          TabId: "CMD",
        })
        .up()
        //Esconde a tab do CC (retirar esta parte se se pretender mostrar as hipóteses CC e CMD)
        .ele("fa:hideAuthTab", {
          TabId: "CC",
        })
        .end();

      return xml;
    },
    buildSamlRequest(xml, uuid) {
      this.$request("post", "/auth/adicionar", {
        id: uuid,
        url: window.location.protocol + "//" + window.location.host,
      });

      var sig = new SignedXml();
      sig.signingKey = SigningKey;
      sig.keyInfoProvider = new FileKeyInfo();
      sig.addReference(
        "//*[local-name(.)='AuthnRequest']",
        [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/2001/10/xml-exc-c14n#",
        ],
        "http://www.w3.org/2000/09/xmldsig#sha1"
      );
      sig.computeSignature(xml, {
        location: { reference: "//*[local-name(.)='Issuer']", action: "after" },
      });

      //Metodo auxiliar pra adicionar X509, visto o keyInfoProvider nao funcionar em Typescript
      return sig.getSignedXml().replace("<X509Data/>", this.generateX509());
    },
    generateX509() {
      return (
        "<X509Data><X509Certificate>" +
        this.stripPEMHeaders(X509Certificate) +
        "</X509Certificate></X509Data>"
      );
    },
    stripPEMHeaders(pem) {
      const re = /-----BEGIN [0-9A-Z ]+-----([^-]*)-----END [0-9A-Z ]+-----/g;
      const pemData = re.exec(pem);
      if (pemData) {
        return pemData[1].replace(/[\r\n|\n]/g, "");
      } else {
        const stripped = pem.replace(/[\r\n|\n]/g, "");
        const base64DecodedAndBack = Buffer.from(stripped, "base64").toString("base64");
        if (stripped == base64DecodedAndBack) {
          return stripped;
        } else {
          throw new Error("provided certificate or key is not PEM-encoded");
        }
      }
    },
    stripExtension(xml) {
      return xml.replace(
        'Extensions xmlns="urn:oasis:names:tc:SAML:2.0:protocol"',
        "Extensions"
      );
    },
    createSAML(type) {
      var uuid = "_" + uuidv4();
      var xml;
      if (type == "CC") xml = this.ccXML(uuid);
      else if (type == "CMD") xml = this.cmdXML(uuid);
      else throw "ERRO: tipo inválido";
      return btoa(this.stripExtension(this.buildSamlRequest(xml, uuid)));
    },
  },
};
</script>
<style scoped>
.v-tab {
  text-transform: none !important;
}
ul li {
  list-style: none;
  color: #606060;
  font-size: 0.9em;
  margin-bottom: 1rem;
  position: relative;
}
ul li::before {
  content: "\2022";
  position: absolute;
  left: -1.8rem;
  top: -0.3rem;
  font-size: 4em;
  color: #4da0d0;
}
</style>
