import os
import tempfile
import ffmpeg
from google.cloud.video import live_stream_v1
from google.cloud.video.live_stream_v1.services.livestream_service import (
    LivestreamServiceClient,
)
from google.cloud import storage
from google.protobuf import duration_pb2 as duration
import google.api_core.exceptions as google_exceptions
import logging

# Adapted from https://cloud.google.com/livestream/docs/quickstarts/quickstart-hls

AWAITING_LIVE = 0
LIVE = 1
VOD = 2

project_id = "livefeed-443712"
location = "europe-west2"
bucket_name = "livefeed-bucket"

ffmpeg_binary_path = os.path.join(os.getcwd(), 'ffmpeg', 'ffmpeg')

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
    logging.info(f"Input: {response.name}")

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
                        seconds=6,
                    ),
                ),
            ),
            live_stream_v1.types.MuxStream(
                key="mux_audio",
                elementary_streams=["es_audio"],
                segment_settings=live_stream_v1.types.SegmentSettings(
                    segment_duration=duration.Duration(
                        seconds=6,
                    ),
                ),
            ),
        ],
        manifests=[
            live_stream_v1.types.Manifest(
                file_name="manifest.m3u8",
                type_="HLS",
                mux_streams=["mux_video", "mux_audio"],
                max_segment_count=50,
                segment_keep_duration=duration.Duration(
                    seconds=120,
                ),
            ),
        ],
    )
    operation = client.create_channel(
        parent=parent, channel=channel, channel_id=channel_id
    )
    response = operation.result(600)
    logging.info(f"Channel: {response.name}")

    return response

def delete_input(channel_id: str):
    client = LivestreamServiceClient()
    input = f"projects/{project_id}/locations/{location}/inputs/input-{channel_id}"

    request=live_stream_v1.DeleteInputRequest(
        name=input
    )
    
    operation = client.delete_input(request)
    response = operation.result(600)
    
    return response

def delete_channel(channel_id: str):
    client = LivestreamServiceClient()
    name = f"projects/{project_id}/locations/{location}/channels/{channel_id}"

    request=live_stream_v1.DeleteChannelRequest(
        name=name,
    )
    
    operation = client.delete_channel(request)
    response = operation.result(600)
    
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
    logging.info(f"Channel: {response.name}")

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
    logging.info("Started channel")

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
    logging.info("Stopped channel")

    return response

def create_recipe_channel(recipe_id):
    input = create_input(recipe_id)
    logging.info(create_channel(recipe_id))

    channel_info = get_channel(recipe_id)
    stream_dict = {"output_url": channel_info.output.uri, "input_url": input.uri}

    return stream_dict

def delete_recipe_channel(recipe_id):
    delete_channel(recipe_id)
    delete_input(recipe_id)

def start_stream(recipe_id):
    logging.info(start_channel(recipe_id))

    return get_channel(recipe_id)

def stop_stream(recipe_id):
    logging.info(stop_channel(recipe_id))

    return get_channel(recipe_id)

def rename_stream(recipe_id):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    stream_directory = f'outputs/output-{recipe_id}'
    vod_directory = f'temp-vods/vod-{recipe_id}'
    blobs = bucket.list_blobs(prefix=stream_directory)
    for blob in blobs:
        new_name = blob.name.replace(stream_directory, vod_directory, 1)
        bucket.copy_blob(blob, bucket, new_name)
        #bucket.rename_blob(blob, new_name)

    public_url = bucket.blob(f'{vod_directory}/manifest.m3u8').public_url
    
    logging.info("Output renamed")

    return public_url

def delete_blob_directory(blob_prefix):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blobs = list(bucket.list_blobs(prefix=blob_prefix))

    try:
        bucket.delete_blobs(blobs)
        logging.info("Blobs deleted")
    except google_exceptions.NotFound:
        logging.info("Blob directory not found")

def delete_temp_vod(recipe_id):
    delete_blob_directory(f'temp-vods/vod-{recipe_id}')

def delete_vod(recipe_id):
    delete_blob_directory(f'vods/vod-{recipe_id}')

def upload_vod(vod_blob_path, local_path):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    vod_blob = bucket.blob(vod_blob_path)
    vod_blob.upload_from_filename(local_path)
    logging.info(f"Uploaded {local_path} to {vod_blob_path}")

    return vod_blob.public_url
    
def convert_stream(vod_manifest, output_mp4_path):
    try:
        (
            ffmpeg
            .input(vod_manifest)
            .output(output_mp4_path, vcodec='libx264', acodec='aac', strict='experimental', hls_flags='single_file').run(cmd=ffmpeg_binary_path, overwrite_output=True, capture_stderr=True, capture_stdout=False)
        )
        logging.info(f"Conversion successful: {output_mp4_path}")
    except ffmpeg.Error as e:
        if e.stderr:
            error_message = e.stderr.decode("utf-8")
            logging.error(f"FFmpeg stderr: {error_message}")
        else:
            error_message = "Unknown error occurred during FFmpeg execution."
            logging.error(error_message)
        raise RuntimeError(f"FFmpeg conversion failed: {error_message}")
    
def convert_temp_to_vod(temp_vod_manifest, recipe_id):
    vod_blob_path = f'vods/vod-{recipe_id}/video.mp4'
    public_url = None

    with tempfile.TemporaryDirectory() as temp_dir:
        output_mp4_path = os.path.join(temp_dir, "output.mp4")
        logging.info(output_mp4_path)
        
        convert_stream(temp_vod_manifest, output_mp4_path)
        
        public_url = upload_vod(vod_blob_path, output_mp4_path)

    delete_temp_vod(recipe_id)

    return public_url

def save_vod(recipe_id):
    temp_vod_manifest = rename_stream(recipe_id)

    return convert_temp_to_vod(temp_vod_manifest, recipe_id)

def delete_all_channels():
    client = LivestreamServiceClient()
    
    list_request = live_stream_v1.ListChannelsRequest(
        parent=f"projects/{project_id}/locations/{location}",
        page_size=10
    )

    channels = list(client.list_channels(list_request))

    for channel in channels:
        delete_request = live_stream_v1.DeleteChannelRequest(name = channel.name)
        client.delete_channel(delete_request)

def delete_all_inputs():
    client = LivestreamServiceClient()
    
    list_request = live_stream_v1.ListInputsRequest(
        parent=f"projects/{project_id}/locations/{location}",
        page_size=10
    )

    inputs = list(client.list_inputs(list_request))

    for input in inputs:
        delete_request = live_stream_v1.DeleteInputRequest(name = input.name)
        client.delete_input(delete_request)