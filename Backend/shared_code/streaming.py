from google.cloud.video import live_stream_v1
from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)
from google.cloud import storage
from google.protobuf import duration_pb2 as duration
import google.api_core.exceptions as google_exceptions
import logging

# Adapted from https://cloud.google.com/livestream/docs/quickstarts/quickstart-hls

project_id = "livefeed-443712"
location = "europe-west2"

def create_input(channel_id: str) -> live_stream_v1.types.Input:
    """Creates an input.
    Args:
        project_id: The GCP project ID.
        location: The location in which to create the input.
        input_id: The user-defined input ID."""

    client = LivestreamServiceClient()

    parent = f"projects/{project_id}/locations/{location}"

    input = live_stream_v1.types.Input(
        type_="RTMP_PUSH",
    )
    operation = client.create_input(parent=parent, input=input, input_id=f"input-{channel_id}")
    response = operation.result(900)
    print(f"Input: {response.name}")

    return response


def create_channel(channel_id: str) -> live_stream_v1.types.Channel:
    """Creates a channel.
    Args:
        project_id: The GCP project ID.
        location: The location in which to create the channel.
        channel_id: The user-defined channel ID.
        input_id: The user-defined input ID.
        output_uri: Uri of the channel output folder in a Cloud Storage bucket."""

    client = LivestreamServiceClient()
    parent = f"projects/{project_id}/locations/{location}"
    input = f"projects/{project_id}/locations/{location}/inputs/input-{channel_id}"
    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"

    channel = live_stream_v1.types.Channel(
        name=name,
        input_attachments=[
            live_stream_v1.types.InputAttachment(
                key="my-input",
                input=input,
            ),
        ],
        output=live_stream_v1.types.Channel.Output(
            uri=f"gs://livefeed-bucket/outputs/output-{channel_id}",
        ),
        elementary_streams=[
            live_stream_v1.types.ElementaryStream(
                key="es_video",
                video_stream=live_stream_v1.types.VideoStream(
                    h264=live_stream_v1.types.VideoStream.H264CodecSettings(
                        profile="high",
                        width_pixels=1280,
                        height_pixels=720,
                        bitrate_bps=3000000,
                        frame_rate=30,
                    ),
                ),
            ),
            live_stream_v1.types.ElementaryStream(
                key="es_audio",
                audio_stream=live_stream_v1.types.AudioStream(
                    codec="aac", channel_count=2, bitrate_bps=160000
                ),
            ),
        ],
        mux_streams=[
            live_stream_v1.types.MuxStream(
                key="mux_video",
                elementary_streams=["es_video"],
                segment_settings=live_stream_v1.types.SegmentSettings(
                    segment_duration=duration.Duration(
                        seconds=2,
                    ),
                ),
            ),
            live_stream_v1.types.MuxStream(
                key="mux_audio",
                elementary_streams=["es_audio"],
                segment_settings=live_stream_v1.types.SegmentSettings(
                    segment_duration=duration.Duration(
                        seconds=2,
                    ),
                ),
            ),
        ],
        manifests=[
            live_stream_v1.types.Manifest(
                file_name="manifest.m3u8",
                type_="HLS",
                mux_streams=["mux_video", "mux_audio"],
                max_segment_count=5,
            ),
        ],
    )
    operation = client.create_channel(
        parent=parent, channel=channel, channel_id=channel_id
    )
    response = operation.result(600)
    print(f"Channel: {response.name}")

    return response

def get_channel(channel_id: str) -> live_stream_v1.types.Channel:
    """Gets a channel.
    Args:
        project_id: The GCP project ID.
        location: The location of the channel.
        channel_id: The user-defined channel ID."""

    client = LivestreamServiceClient()

    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"
    response = client.get_channel(name=name)
    print(f"Channel: {response.name}")

    return response

def start_channel(channel_id: str) -> live_stream_v1.types.ChannelOperationResponse:
    """Starts a channel.
    Args:
        project_id: The GCP project ID.
        location: The location of the channel.
        channel_id: The user-defined channel ID."""

    client = LivestreamServiceClient()

    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"
    operation = client.start_channel(name=name)
    response = operation.result(900)
    print("Started channel")

    return response

def stop_channel(channel_id: str) -> live_stream_v1.types.ChannelOperationResponse:
    """Stops a channel.
    Args:
        project_id: The GCP project ID.
        location: The location of the channel.
        channel_id: The user-defined channel ID."""

    client = LivestreamServiceClient()

    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"
    operation = client.stop_channel(name=name)
    response = operation.result(600)
    print("Stopped channel")

    return response

def create_recipe_channel(recipe_id):
    create_input(recipe_id)
    create_channel(recipe_id)

    return get_channel(recipe_id)

def start_stream(recipe_id):
    logging.info(start_channel(recipe_id))

    return get_channel(recipe_id)

def stop_stream(recipe_id):
    logging.info(stop_channel(recipe_id))

    return get_channel(recipe_id)

def save_vod(recipe_id):
    storage_client = storage.Client()
    bucket = storage_client.bucket('livefeed-bucket')
    vod_name = f'vods/vod-{recipe_id}'
    public_url = bucket.copy_blob(f'outputs/output-{recipe_id}', bucket, vod_name).public_url
    
    return f"{public_url}/manifest.m3u8"