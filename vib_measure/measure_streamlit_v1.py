# IMPORTS
import streamlit as st
import pandas as pd
import numpy as np
import time
import hiplot as hip
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.figure_factory as ff
import plotly.express as px


st.set_page_config(
    page_title="VIB Web App",
    page_icon=":balloon:",
    layout="wide",  # alt:centered
    initial_sidebar_state="collapsed",
    menu_items={
        "Get Help": "https://www.extremelycoolapp.com/help",
        "Report a bug": "https://www.extremelycoolapp.com/bug",
        "About": "# Testing out a Streamlit Web App\n ### Attempting to visualizing measure data...",
    },
)

# TITLE
st.title("Value-Intention-Behavior Measure")
"---"

# LOAD DATA
DATE_COLUMN = "date/time"
DATA_URL = (
    "https://s3-us-west-2.amazonaws.com/"
    "streamlit-demo-data/uber-raw-data-sep14.csv.gz"
)
FULL_DATA_PATH = "vib_measure/data/streamlit.csv"
# GAP_DATA_PATH = "data/streamlit.csv"
# VALID_DATA_PATH = "data/streamlit.csv"
DEMO_DATA_PATH = "vib_measure/data/streamlit_demo.csv"


@st.cache
def load_full():
    data = pd.read_csv(FULL_DATA_PATH, index_col=[0])
    return data


@st.cache
def load_gap(df):
    data = df.filter(like="gap", axis=1)
    return data


@st.cache
def load_validation(df):
    data = df[df.columns[~(df.columns.str.contains("gap"))]]
    data = data.drop(["subjectID"], axis=1)
    return data


@st.cache
def load_demo():
    data = pd.read_csv(DEMO_DATA_PATH, index_col=[0])
    data.rename(
        columns={"LocationLongitude": "lon", "LocationLatitude": "lat"}, inplace=True
    )
    return data


full_data = load_full()
gap_data = load_gap(full_data)
valid_data = load_validation(full_data)
demo_data = load_demo()

# SUBJECTS
"## Subjects"
"#### Locations"
st.map(demo_data[["lat", "lon"]])

# DISTRIBUTIONS
"---"
try:
    measure_dist
except NameError:
    st.write("## Explore Data")
else:
    st.write("## Explore Data", measure_dist.replace("_", " ").title())

dist1, dist2, dist3 = st.columns([0.75, 2.5, 0.75])
with dist1:
    "#### Measure"
    measure_dist = st.selectbox("Select...", sorted(full_data.columns.tolist()))

with dist2:
    hist_data = [full_data[measure_dist]]  # , x2, x3
    group_labels = [""]
    # Create distplot with custom bin_size
    # fig = ff.create_distplot(hist_data, group_labels, bin_size=[1])  # , 0.25, 0.5
    fig = px.violin(
        full_data,
        y=measure_dist,
        box=True,  # draw box plot inside the violin
        points="all",  # can be 'outliers', or False
    )
    fig.update_layout(title_text=measure_dist.replace("_", " ").title())
    st.plotly_chart(fig, use_container_width=True)

with dist3:
    st.write("#### Summary\n", measure_dist.replace("_", " ").title())
    st.write((full_data[measure_dist]).describe())

# CORRELATION LAYOUT
"---"
st.write("## Correlations")
col1, col2 = st.columns([1.5, 2.5])

with col1:
    st.subheader("Measures")
    options = st.multiselect(
        "Select measures of interest",
        sorted(full_data.columns.tolist()),
        ["w_domain_gap", "overall_value_gap"],
    )

if len(options) == 0:
    st.warning("You need to select at least one measure...")
    options = ["w_domain_gap"]

with col2:
    st.subheader("Correlation Matrix")
    fig, ax = plt.subplots()
    sns.heatmap(
        full_data[options].corr(),
        center=0,
        linewidths=0.5,
        cmap=sns.diverging_palette(220, 20, n=256),
        annot=True,
        ax=ax,
    )
    st.write(fig)

# DATA
if st.checkbox("Show raw data"):
    st.subheader("Raw data")
    st.dataframe(full_data[options].style.background_gradient(axis=0))


@st.cache
def load_data(nrows):
    data = pd.read_csv(DATA_URL, nrows=nrows)
    lowercase = lambda x: str(x).lower()
    data.rename(lowercase, axis="columns", inplace=True)
    data[DATE_COLUMN] = pd.to_datetime(data[DATE_COLUMN])
    return data


# HiPlot
"---"
"## Explore Data with HiPlot"
"[HiPlot](https://github.com/facebookresearch/hiplot) is a lightweight interactive visualization tool to help AI researchers discover correlations and patterns in high-dimensional data using parallel plots and other graphical ways to represent information."

exp = hip.Experiment.from_dataframe(full_data)
data_select = st.radio("Filter Data", ("All", "Gap Measures", "Validation Measures"))
if data_select == "All":
    exp.display_data(hip.Displays.PARALLEL_PLOT).update(
        {"hide": ["subjectID", "Unnamed: 0"]}
    )  # Change ['uid'] to a list of column names to be hidden. E.g. ['uid', 'dropout']
if data_select == "Gap Measures":
    exp.display_data(hip.Displays.PARALLEL_PLOT).update(
        {
            "hide": [
                "subjectID",
                "Unnamed: 0",
                "self_esteem_single_1",
                "swl_cantril_ladder",
                "tipi_extraversion",
                "tipi_agreeableness",
                "tipi_conscientiousness",
                "tipi_emoStability",
                "tipi_openExperience",
                "grit_score",
                "workEthic_score",
                "future_score",
                "bscs_score",
                "ambition_score",
                "boredomProne_score",
                "boredomProne_ext",
                "boredomProne_int",
                "ccs_score",
                "ccs_order",
                "ccs_virtue",
                "ccs_tradition",
                "ccs_selfC",
                "ccs_responsibility",
                "ccs_industriousness",
                "needForCognition_score",
            ]
        }
    )
if data_select == "Validation Measures":
    exp.display_data(hip.Displays.PARALLEL_PLOT).update(
        {
            "hide": [
                "subjectID",
                "Unnamed: 0",
                "overall_gap_pre",
                "overall_gap_post",
                "global_achieve_gap",
                "global_belief_gap",
                "belief_achieve_gap",
                "cat_intend_gap",
                "domain_gap",
                "w_domain_gap",
                "overall_value_gap",
                "eisen_urg_imp",
                "eisen_Xurg_imp",
                "eisen_urg_Ximp",
                "eisen_Xurg_Ximp",
            ]
        }
    )
exp.to_streamlit(key="subjectID").display()
