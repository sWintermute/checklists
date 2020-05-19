import ApiService from "@/services/api.js";
import { format } from "date-fns";
import download from "downloadjs";
import XLSX from "xlsx";

export default {
  async FETCH_FILLED_CHECKLIST({ commit }, { id }) {
    this.commit("SET_LOADING_STATUS", true);
    ApiService.setHeader();
    try {
      const { data } = (
        await Promise.all([
          ApiService.get(`api/v1/response`, id),
          new Promise(resolve => setTimeout(() => resolve(), 500))
        ])
      )[0];
      await this.dispatch("checklists/FETCH_CHECKLIST", data.survey);
      const { questions } = this.state.checklists.list;
      const responseAnswers = data.answers

      // [...questions, ...responseQuestions].filter(question => question.)

      let answers = {}

      for (let question of questions) {
        if (question.type === 'select-image') {
          console.log(question)
        } else {
          answers[question.text] = {
            body: "",
            question
          }
        }
      }

      for (let answer of responseAnswers) {
        answers[answer.question.text] = answer
      }

      commit("SET_FILLED_LIST", Object.assign({}, data, {
        answers: Object.keys(answers).map(key => answers[key])
      }));
      this.commit("SET_LOADING_STATUS", false);
    } catch (error) {
      this.commit("SET_LOADING_STATUS", false);
      console.log(error);
    }
  },
  async FETCH_FILLED_CHECKLISTS(state) {
    try {
      this.commit("SET_LOADING_STATUS", true);
      ApiService.setHeader();
      const response = (
        await Promise.all([
          ApiService.get("api/v1/responses"),
          await new Promise(resolve => setTimeout(() => resolve(), 500))
        ])
      )[0];
      state.commit("SET_FILLED_LISTS", response.data.sort((answer, prevAnswer) => { if (answer.question.order < prevAnswer.question.order) return -1 }));
      this.commit("SET_LOADING_STATUS", false);
    } catch (error) {
      this.commit("SET_LOADING_STATUS", false);
      console.log(error);
    }
  },
  async CREATE_EXCEL(store, { excelData }) {
    try {
      this.commit("SET_LOADING_STATUS", true);
      ApiService.setHeader();
      const { data: responses } = await ApiService.get("api/v1/responses", "", {
        params: {
          from: excelData.date_from,
          to: excelData.date_to,
          lists: excelData.checklists
        }
      });

      const wb = XLSX.utils.book_new();
      const currentChecklist = this.state.checklists.lists.filter(item => {
        return item.id === excelData.checklists;
      })[0];
      const headers = {
        "Номер ответа": [],
        "Дата создания": [],
        Почта: []
      };
      const rows = [];
      for (const response of responses) {
        const { id, created, answers, user_text } = response;
        let answersHeadersList = ["Номер ответа", "Дата создания", "Почта"];

        headers["Номер ответа"].push(id);
        headers["Дата создания"].push(format(new Date(created), "yyyy-MM-dd'T'hh:mm:ss"));
        headers["Почта"].push(user_text);

        for (let { question, body } of answers) {
          answersHeadersList.push(question.question_text);

          console.log(question.question_text)

          Array.isArray(headers[question.question_text])
            ? headers[question.question_text].push(body)
            : (headers[question.question_text] = [body]);
        }

        for (let header of Object.keys(headers)) {
          if (!answersHeadersList.includes(header)) {
            Array.isArray(headers[header]) ? headers[header].push("") : (headers[header] = [""]);
          }
        }
      }

      rows.unshift(Object.keys(headers));

      let foo = Object.values(headers)[0];

      for (let i = 0; i < foo.length; i++) {
        let item = [];
        for (let header of Object.keys(headers)) {
          if (headers[header].length < foo.length) {
            let bar = foo.length - headers[header].length;
            for (let j = 0; j < bar; j++) {
              headers[header].unshift("");
            }
          }
          headers[header][i] ? item.push(headers[header][i]) : item.push("");
        }
        rows.push(item);
      }

      const wsData = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
      XLSX.utils.book_append_sheet(wb, wsData, `${currentChecklist.name}`);
      const str = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      download(str, `${currentChecklist.name}.xlsx`, "application/vnd.ms-excel");
      this.commit("SET_LOADING_STATUS", false);
    } catch (error) {
      this.commit("SET_LOADING_STATUS", false);
      console.log(error);
    }
  },
  async FETCH_MAP({ commit }) {
    this.commit("SET_LOADING_STATUS", true);
    ApiService.setHeader();
    try {
      const { data } = await ApiService.get("api/v1/maps");
      const handler = {
        get: function(target, name) {
          return target.hasOwnProperty(name) ? target[name] : [];
        }
      };
      const proxyPoints = new Proxy({}, handler);

      for (let point of data) {
        let key = `${point.lat}-${point.lon}`;
        proxyPoints[key] = proxyPoints[key].concat(point);
      }
      const points = Object.assign({}, proxyPoints);

      const mappedPoints = Object.keys(points).map(i => {
        const [lat, lon] = i.split("-");
        return { lat, lon, points: points[i] };
      });

      commit("SET_MAP", mappedPoints);
      this.commit("SET_LOADING_STATUS", false);
    } catch (error) {
      this.commit("SET_LOADING_STATUS", false);
      console.log(error);
    }
  },
  async UPDATE_FILLED_CHECKLIST({ commit, dispatch, state }) {
    this.commit("SET_LOADING_STATUS", true);
    ApiService.setHeader();
    try {
      const { id, survey, answers, photo } = state.filledList;
      await ApiService.put("api/v1/response", id, {
        survey,
        answers,
        photo
      });
      dispatch("FETCH_FILLED_CHECKLIST", { id });
      this.commit("SET_LOADING_STATUS", false);
    } catch (error) {
      this.commit("SET_LOADING_STATUS", false);
      console.log(error);
    }
  },
  async DELETE_FILLED_CHECKLIST({ commit, dispatch, state }, { responseId }) {
    this.commit("SET_LOADING_STATUS", true);
    ApiService.setHeader();
    try {
      await ApiService.delete("api/v1/response", responseId);
      await dispatch("FETCH_FILLED_CHECKLISTS");
      this.commit("SET_LOADING_STATUS", false);
    } catch (error) {
      this.commit("SET_LOADING_STATUS", false);
      console.log(error);
    }
  }
};
