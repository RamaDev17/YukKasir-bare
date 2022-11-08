import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Header } from '../../components/Header';
import { COLORS, SIZES } from '../../constants';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../../actions/reportActions';
import DropDownPicker from 'react-native-dropdown-picker';
import { tahun as tahunNow, bulan as bulanNow } from '../../utils/date';
import { nFormatter } from '../../utils/formatter';
import { formatNumber } from 'react-native-currency-input';
import CardGraph from '../../components/CardGraph';

let tahun = [];
let itemTahunArray = [];
let bulan = [];
let dataProfitMentah = [];
const CekBulan = () => {
  let result = 0;
  if (
    bulanNow == 'Juli' ||
    bulanNow == 'Agustus' ||
    bulanNow == 'September' ||
    bulanNow == 'Oktober' ||
    bulanNow == 'November' ||
    bulanNow == 'Desember'
  ) {
    result = 2;
  } else {
    result = 1;
  }

  return result;
};

const LaporanPage = ({ navigation }) => {
  const [reportBulan, setReportBulan] = useState([]);
  const [reportTahun, setReportTahun] = useState([]);
  // dropdown picker Bulan
  const [openInput, setOpenInput] = useState(false);
  const [categoryBulan, setCategoryBulan] = useState(CekBulan());
  const [itemBulan, setItemBulan] = useState([
    { label: 'Januari - Juni', value: 1 },
    { label: 'Juli - Desember', value: 2 },
  ]);
  // dropdown picker Tahun
  const [openInputTahun, setOpenInputTahun] = useState(false);
  const [categoryTahun, setCategoryTahun] = useState(tahunNow.toString());
  const [itemTahun, setItemTahun] = useState(itemTahunArray);
  // Labels line cart
  const [labels, setLabels] = useState([]);
  // menyimpan data profit per bulannya
  const [januari, setjanuari] = useState([]);
  const [februari, setfebruari] = useState([]);
  const [maret, setmaret] = useState([]);
  const [april, setapril] = useState([]);
  const [mei, setmei] = useState([]);
  const [juni, setjuni] = useState([]);
  const [juli, setjuli] = useState([]);
  const [agustus, setagustus] = useState([]);
  const [september, setseptember] = useState([]);
  const [oktober, setoktober] = useState([]);
  const [november, setnovember] = useState([]);
  const [desember, setdesember] = useState([]);
  // dataset
  const [dataset, setDataset] = useState([0, 0, 0, 0, 0, 0]);

  const dispatch = useDispatch();
  const result = useSelector((state) => state.ReportReducer.getreportResult);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      dispatch(getReports());
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dataProfitMentah = [];
    Object.keys(result).map((key) => {
      const date = result[key].date;
      const dateSplit = date.split(' ');
      bulan.push(dateSplit[2]);
      tahun.push(dateSplit[3]);
      dataProfitMentah.push({
        bulan: dateSplit[2],
        tahun: dateSplit[3],
        profit: result[key].jumlahProfit,
      });
    });
    setReportBulan([...new Set(bulan)]);
    setReportTahun([...new Set(tahun)]);
  }, [result]);

  useEffect(() => {
    itemTahunArray = [];
    reportTahun.map((key) => {
      itemTahunArray.push({ label: key, value: key });
    });
    setItemTahun(itemTahunArray);
    if (
      bulanNow == 'Juli' ||
      bulanNow == 'Agustus' ||
      bulanNow == 'September' ||
      bulanNow == 'Oktober' ||
      bulanNow == 'November' ||
      bulanNow == 'Desember'
    ) {
      setCategoryBulan(2);
    } else {
      setCategoryBulan(1);
    }
  }, [reportTahun]);

  useEffect(() => {
    if (categoryBulan == 1) {
      setLabels(['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']);
    } else {
      setLabels(['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']);
    }
  }, [categoryBulan]);

  useEffect(() => {
    setjanuari([]);
    setfebruari([]);
    setmaret([]);
    setapril([]);
    setmei([]);
    setjuni([]);
    setjuli([]);
    setagustus([]);
    setseptember([]);
    setoktober([]);
    setnovember([]);
    setdesember([]);

    if (categoryBulan == 1) {
      Object.keys(dataProfitMentah).map((key) => {
        const data = dataProfitMentah[key];
        if (
          data.bulan == 'Januari' ||
          data.bulan == 'Februari' ||
          data.bulan == 'Maret' ||
          data.bulan == 'April' ||
          data.bulan == 'Mei' ||
          data.bulan == 'Juni'
        ) {
          if (data.tahun == categoryTahun) {
            if (data.bulan == 'Januari') {
              setjanuari((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'Februari') {
              setfebruari((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'Maret') {
              setmaret((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'April') {
              setapril((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'Mei') {
              setmei((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'Juni') {
              setjuni((oldarray) => [...oldarray, data.profit]);
            }
          }
        }
      });
    } else {
      Object.keys(dataProfitMentah).map((key) => {
        console.log('1');
        const data = dataProfitMentah[key];
        if (
          data.bulan == 'Juli' ||
          data.bulan == 'Agustus' ||
          data.bulan == 'September' ||
          data.bulan == 'Oktober' ||
          data.bulan == 'November' ||
          data.bulan == 'Desember'
        ) {
          if (data.tahun == categoryTahun) {
            console.log('2');
            if (data.bulan == 'Juli') {
              setjuli((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'Agustus') {
              setagustus((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'September') {
              setseptember((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'Oktober') {
              setoktober((oldarray) => [...oldarray, data.profit]);
            } else if (data.bulan == 'November') {
              setnovember((oldarray) => [...oldarray, data.profit]);
              console.log('3');
            } else if (data.bulan == 'Desember') {
              setdesember((oldarray) => [...oldarray, data.profit]);
            }
          }
        }
      });
    }
  }, [categoryBulan, categoryTahun, reportBulan]);

  useEffect(() => {
    if (categoryBulan == 1) {
      setDataset([
        numArray(januari),
        numArray(februari),
        numArray(maret),
        numArray(april),
        numArray(mei),
        numArray(juni),
      ]);
    } else {
      setDataset([
        numArray(juli),
        numArray(agustus),
        numArray(september),
        numArray(oktober),
        numArray(november),
        numArray(desember),
      ]);
    }
  }, [
    januari,
    februari,
    maret,
    april,
    mei,
    juli,
    juni,
    agustus,
    september,
    oktober,
    november,
    desember,
  ]);

  const numArray = (array) => {
    let total = 0;
    if (array.length == 0) {
      total = 0;
    } else {
      for (let i = 0; i < array.length; i++) {
        total += array[i];
      }
      total = formatNumber(total);
    }
    return total;
  };

  console.log(november);

  return (
    <View style={styles.container}>
      <Header name="Laporan Transaksi" navigation={navigation} />
      <View style={{ marginTop: 90 }} />
      <FlashMessage duration={2000} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[styles.row, { marginBottom: 15, justifyContent: 'space-between', zIndex: 100 }]}
        >
          <DropDownPicker
            open={openInput}
            value={categoryBulan}
            items={itemBulan}
            setOpen={setOpenInput}
            setValue={setCategoryBulan}
            setItems={setItemBulan}
            placeholder="Pilih rentang bulan"
            style={[styles.input]}
            listMode="SCROLLVIEW"
            dropDownContainerStyle={{ borderColor: COLORS.primary }}
            containerStyle={{ width: '50%' }}
          />
          <DropDownPicker
            open={openInputTahun}
            value={categoryTahun}
            items={itemTahun}
            setOpen={setOpenInputTahun}
            setValue={setCategoryTahun}
            setItems={setItemTahun}
            placeholder="Tahun"
            style={[styles.input]}
            listMode="SCROLLVIEW"
            dropDownContainerStyle={{ borderColor: COLORS.primary }}
            containerStyle={{ width: '40%' }}
          />
        </View>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: dataset,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // from react-native
          onDataPointClick={({ value, getColor }) =>
            showMessage({
              message: `Rp. ${value}`,
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              style: {
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              },
            })
          }
          height={200}
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <View style={{ marginBottom: 15 }} />
        {categoryBulan == 1 ? (
          <View>
            <CardGraph profit={numArray(januari)} bulan="Januari" tahun={categoryTahun} />
            <CardGraph profit={numArray(februari)} bulan="Februari" tahun={categoryTahun} />
            <CardGraph profit={numArray(maret)} bulan="Maret" tahun={categoryTahun} />
            <CardGraph profit={numArray(april)} bulan="April" tahun={categoryTahun} />
            <CardGraph profit={numArray(mei)} bulan="Mei" tahun={categoryTahun} />
            <CardGraph profit={numArray(juni)} bulan="Juni" tahun={categoryTahun} />
          </View>
        ) : (
          <View>
            <CardGraph profit={numArray(juli)} bulan="Juli" tahun={categoryTahun} />
            <CardGraph profit={numArray(agustus)} bulan="Agustus" tahun={categoryTahun} />
            <CardGraph profit={numArray(september)} bulan="September" tahun={categoryTahun} />
            <CardGraph profit={numArray(oktober)} bulan="Oktober" tahun={categoryTahun} />
            <CardGraph profit={numArray(november)} bulan="November" tahun={categoryTahun} />
            <CardGraph profit={numArray(desember)} bulan="Desember" tahun={categoryTahun} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: '100%',
  },
  card: {
    padding: 10,
  },
});

export default LaporanPage;
